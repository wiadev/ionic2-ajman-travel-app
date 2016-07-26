import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '../http-client/http-client'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import * as moment from 'moment';

let PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-upsert'));
PouchDB.plugin(require('pouchdb-find'));


@Injectable()
export class DbService {
  _data: any;
  _db: any;
  _entity: string;
  http: HttpClient;
  moment: any;

  constructor(@Inject(HttpClient) httpClient: HttpClient) {
    this._data = null;
    this._entity = null;
    this.http = httpClient;
    this.moment = moment;
    window['PouchDB'] = PouchDB;
  }

  checkEntity() {
    if(!this._entity) {
      console.error("Not entity set");
      return false;
    }
  }

  setEntity(entity) {
    this._entity = entity;
    this._db = new PouchDB(this._entity, { adapter: 'websql', iosDatabaseLocation: 'default'});
  }

  getEntity() {
    return this._entity;
  }

  sync(dataUrl) {
    var that = this
    this.checkEntity();
     return this.http.get(dataUrl)
      .timeout(3000)
          .map(res => res.json()).toPromise()
          .then
        (result => {
          console.log("Fetching Server: "+this._entity);
          var reg = {};
          var promises = [];
          for(var o in result._embedded.content) {
            
            var item = result._embedded.content[o];
            reg[item.id] = item;

            
            
            reg[item.id]._id = this._entity+"_"+item.id;

            

            delete(reg[item.id]._links);
            
            promises.push(this._db.get(reg[item.id]._id));
          }
           
          return Promise.all(promises.map(that.reflect)).then(
            (res) => {
              var res = res.filter(x => x.status === "resolved");
              
              
              
               // -----> Updating existing records
               for(var i in res) {  
                 var e = res[i].v;

                  if(that.moment(e.updateDate).isBefore(reg[e.id].updateDate)) {
                    that._db.upsert(reg[e.id]._id, function(doc) {
                      if(doc.id) {
                        var u = doc._id.split("_");
                        var i =  reg[u[1]];
                        delete(reg[u[1]]);
                        return i;
                      }
                    })
                    console.log(["Updating....", e.name]);
                  } else {
                    delete(reg[e.id])
                  }
               }

               // ----> Adding new items to DB
               for(var i in reg) { 
                 var rs = reg[i];
                 
                 that._db.putIfNotExists(rs).then(res => {
                   console.log(["Creating....", res]);
                 });
               }

               return that.getAll();
            }
          ).catch(err => { console.log("error", err)} );
        },
      err => {
        console.log("Error fetching objects", err);  
      });
  }

  reflect(promise){
    return promise.then(function(v){ return {v:v, status: "resolved" }},
                        function(e){ return {e:e, status: "rejected" }});
  }

  remove(id: any) {
    var that = this
    this._db.get(this._entity+"_"+id).then(function (doc) {
      return that._db.remove(doc);
    }, function(e) {
      console.log(e)
    });
  }

  destroy() {
    this.checkEntity();
    var that = this;
    new PouchDB(this._entity).destroy().then(function () {
     console.log("Database "+that._entity+" destroyed successfully");
    }).catch(function (err) {
      console.error("Error to destroy "+that._entity, err);
    })
  }

  addDoc(doc) {
    return this._db.putIfNotExists(doc);
  }

  find(doc) {
    return this._db.get(doc);
  }

  getAll() { 
    this.checkEntity(); 
    
      return this._db.allDocs({ include_docs: true})
        .then(docs => {
            this._data = docs.rows.map(row => {
                return row.doc;
            });

            this._db.changes({ live: true, since: 'now', include_docs: true})
                .on('change', this.onDatabaseChange);

            return this._data;
        });
    
  }

  private onDatabaseChange = (change) => {  
      var index = this.findIndex(this._data, change.id);
      var birthday = this._data[index];

      if (change.deleted) {
          if (birthday) {
              this._data.splice(index, 1); // delete
          }
      } else {
          change.doc.Date = new Date(change.doc.Date);
          if (birthday && birthday._id === change.id) {
              this._data[index] = change.doc; // update
          } else {
              this._data.splice(index, 0, change.doc) // insert
          }
      }
  }

  private findIndex(array, id) {  
      var low = 0, high = array.length, mid;
      while (low < high) {
        mid = (low + high) >>> 1;
        array[mid]._id < id ? low = mid + 1 : high = mid
      }
      return low;
  }
  
}


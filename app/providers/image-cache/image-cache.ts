import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { DbService } from '../../providers/db/db';
import { HttpClient } from '../http-client/http-client'
import { Transfer } from 'ionic-native';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the ImageCache provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ImageCache {
  data: any;
  platform: any;
  _db: any;
  _url: string = "http://40.76.212.209:8022/umbraco/rest/v1/media/";
  _imagesPath: string;

  constructor(private http: HttpClient,  platform: Platform, dbService: DbService) {
    this.data = null;
    this.platform = platform;
    this._db = dbService;
    this.platform.ready().then(() => {
      this._imagesPath = window['cordova'].file.cacheDirectory +"www";
    });
  }

  download(image) {
    this.platform.ready().then(() => {
      const fileTransfer = new Transfer();
      const imageLocation = "http://40.76.212.209:8022"+image;

      let targetPath; // storage location depends on device type.

      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      if(!this.platform.is('cordova')) {
        console.log("platform false");
        return false;
      }

      if (this.platform.is('ios')) {
        targetPath = window['cordova'].file.cacheDirectory +"www"+image;
      }
      else if(this.platform.is('android')) {
        targetPath = window['cordova'].file.cacheDirectory +"www"+ image;
      }
      else {
        // do nothing, but you could add further types here e.g. windows/blackberry
        return false;
      }

      fileTransfer.download(imageLocation, targetPath).then(
          (result) => {
            return result.nativeURL;
          },
          (error) => {
            return "./img/notFound.jpg";
          }
      );
    });
  }
  destroyDB() {
    this._db.setEntity("media");
    this._db.destroy();
    var dir = new window['DirectoryEntry']("media", this._imagesPath+"/media");

  }
 
  getImage(id) {
    var that = this
    return this.platform.ready().then(() => {
      that._db.setEntity("media");
      
      if(window['navigator'].onLine) {
        return that.http.get(that._url+id).timeout(5000).map(res => res.json()).toPromise().then(
                    (result) => {
                      
                      var rs = JSON.parse(result.properties.umbracoFile.replace("src:", '"src":').replace("crops:", '"crops":').replace("'", '"').replace("'", '"'))
                      that.data = rs.src;
                      that.download(that.data)
                      
                      that._db.addDoc({_id: "media_"+id, "url": that.data, "updateDate": result.updateDate}).then(res => {
                         
                      }, (error) => {
                        console.log(error);
                      });
                      return Promise.resolve(that.data);
                   });
      } else {
        return that._db.get("media_"+id).then((res) => {
          return Promise.resolve(res.url);
        })
      }
    });
  }

  showImage(id) {
    var that = this;
    this._db.setEntity("media");
    return this._db.find("media_"+id).then(
      (res) => {
        return res;
      }, 
      (error) => {}
    )
  }

  
}


import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
import { Storage, SqlStorage } from 'ionic-angular';
import 'rxjs/add/operator/map';

let PouchDB = require('pouchdb');

@Injectable()
export class AttractionService {  
    private _db;
    private _attractions;
    http: Http;
    storage: any;

    
    constructor(http: Http) {
		this.http = http;
		this.storage = new Storage(SqlStorage);
		this.storage.query('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)');
    }

    initDB() {
    	var that = this;
		this.http.get('http://jsonplaceholder.typicode.com/users')
	        .map(res => res.json())
	        .subscribe
	      (data => {
	      	this._attractions = JSON.stringify(data);
	        this.applyChanges(this._attractions);
	      },
	    err => {
	      console.log("Fecthing Cache: Users");	
	      this._attractions = this.getAll();
	    });
    }

	public getAll() {
		return this.storage.query('SELECT * FROM users');
	}

	// Save a new note to the DB
	public save(user: any) {
		let sql = 'INSERT OR REPLACE INTO users (id, name, email) VALUES (?,?,?)';
		return this.storage.query(sql, [user.id, user.name, user.email]);
	}

	// Update an existing note with a given ID
	public update(user: any) {
		let sql = 'UPDATE users SET title = \"' + user.name + '\", email = \"' + user.email + '\" WHERE id = \"' + note.id + '\"';
		this.storage.query(sql);
	}

	// Remoe a not with a given ID
	public removeNote(user: any) {
		let sql = 'DELETE FROM users WHERE id = \"' + user.id + '\"';
		this.storage.query(sql);
	}

	public applyChanges(newData) {
    	this.storage.transaction(
	        function(tx) {
	            var l = this._attractions.length;
	            var sql =
	                "INSERT OR REPLACE INTO users (id, name, email, lastModified) " +
	                "VALUES (?, ?, ?, ?)";
	            var e;
	            for (var i = 0; i < l; i++) {
	                e = this._attractions[i];
	                var doIt = false;
	                for(var y in e) {
	                	if(e[y]!=newData[i][y]) {
	                		doIt = true;
	                	}
	                }
	                if(doIt) {
	                	var lastModified = new Date();
	                	var params = [e.id, e.firstName, e.lastName, e.title, e.officePhone, e.deleted, lastModified];
	                	tx.executeSql(sql, params);
	                }
	                
	            }
	        },
	        function(err) {
	        	console.log("error", err)
	        },function(res) {
	        	console.log("Success", res)
	        }
    	);
}
}
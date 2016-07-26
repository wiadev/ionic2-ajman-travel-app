import {Injectable, Inject} from '@angular/core';
import { Storage, SqlStorage } from 'ionic-angular';
import { HttpClient } from '../http-client/http-client'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class UserService { 


    private _db;
    private _users;
    http: HttpClient;
    storage: any;

    
    constructor(@Inject(HttpClient) httpClient: HttpClient) {
		this.http = httpClient;
		this.storage = new Storage(SqlStorage);
		this.storage.query('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)');
    }

    initDB() {
		this.http.get('http://reqres.in/api/users?page=4')
			.timeout(1000)
	        .map(res => res.json())
	        .subscribe
	      (result => {
	      	console.log("Fecthing Server: Users");	
	      	this.getAll().then((tx) => { 
	      		this._users = tx.res.rows._array;
	      		this.applyChanges(result.data); 
	      	});
	        
	      },
	    err => {
	      console.log("Fecthing Cache: Users");	
	      this._users = this.getAll();
	    });
    }

	getAll() {
		this.storage = new Storage(SqlStorage);
		return this.storage.query('SELECT * FROM users');
	}

	save(user: any) {
		let sql = 'INSERT OR REPLACE INTO users (id, name, email) VALUES (?,?,?)';
		return this.storage.query(sql, [user.id, user.name, user.email]);
	}

	update(user: any) {
		let sql = 'UPDATE users SET title = \"' + user.name + '\", email = \"' + user.email + '\" WHERE id = \"' + user.id + '\"';
		this.storage.query(sql);
	}

	remove(user: any) {
		let sql = 'DELETE FROM users WHERE id = \"' + user.id + '\"';
		this.storage.query(sql);
	}

	findById(id: number) {
		this.storage = new Storage(SqlStorage);
		return this.storage.query('SELECT * FROM users where id="'+id+'"');
	}

	searchById(id: number) {
		var users = this._users;
		for(var i in users) {
        	if(users[i].id==id) {
        		return users[i];
        	}
        }
	}

	applyChanges(newData) {
		var items = newData;
    	var l = items.length;
        var sql =
            "INSERT OR REPLACE INTO users (id, name, email) " +
            "VALUES (?, ?, ?)";
        var e;
        for (var i = 0; i < l; i++) {
            e = items[i];
            var user: Object = this.searchById(e.id);
            var doIt = false;
            if(user) {
	            for(var y in e) {
	            	e.name = e.first_name;
	            	if(e[y]!=user[y] && user[y] != undefined) {
	            		console.log("changed data", y, user[y]);
	            		doIt = true;
	            	}
	            }
            } else {
            	doIt = true;
            }
            
            if(doIt) {
            	var lastModified = new Date();
            	var params = [e.id, e.first_name, e.avatar];
            	this.storage.query(sql, params).then((data) => {
            		console.log("Database synched");
            	}, (error) => {
            		console.log("Error Databe sync", error);
            	});
            }
            
        }
	}
}
import { Component, NgZone } from "@angular/core";
import { NavController, Platform } from 'ionic-angular';  
import { UserService } from '../../providers/users/users';

@Component({
  templateUrl: 'build/pages/attractions/attractions.html',
  providers: [UserService]
})
export class Attractions {  
    public attractions = [];

    constructor(private userService: UserService, private nav: NavController, private platform: Platform, private zone: NgZone) {
		this.platform.ready().then(() => {
		    
		    this.userService.getAll().then((tx) => {
		    	var rows = tx.res.rows;
		    	this.attractions = rows._array;
		    })
		        
		});
    }


}
import { Component } from '@angular/core';
import { NavController, Alert, Platform } from 'ionic-angular';
import { HotelService } from '../../providers/hotels/hotels';
import { ImageCache } from '../../providers/image-cache/image-cache';



@Component({
  templateUrl: 'build/pages/hotels/hotels.html',
  providers: [HotelService, ImageCache]
})
export class Hotels {
  
  hotelService: any;
  platform: any;
  fileTransfer: any;
  imageCache: any;
  imagesPath: string = window['cordova'].file.cacheDirectory +"www";
  hotels: any;

  
  constructor(private nav: NavController, hotelService: HotelService, imageCache: ImageCache, platform: Platform) {
  	this.hotelService = hotelService;
    this.imageCache = imageCache;
    this.platform = platform;
    var that = this;
  	this.hotelService.getAll().then(res => {
      this.hotels = res;
  	});
  	
  }

  syncHotels() {
    var that = this;
    var promises = []
  	this.hotelService.syncDB().then(res => {
  		
        for(var i in res) {
          var e = res[i];
          if(e.properties.hotelLogo !== null && typeof e.properties !== "undefined") {
            promises.push(that.imageCache.getImage(e.properties.hotelLogo))
          }
        }
        Promise.all(promises).then(res => {
          that.hotelService.getAll().then(res => {
            that.hotels = res;
          });
        })    
  	
  	});	
  }

  destroyHotels() {
    this.hotelService.destroyDB();
  	this.hotels = [];	
    this.hotelService.getAll().then(res => {
      this.hotels = res;
    });
  }

  removeHotel(id: any) {
  	this.hotelService.remove(id).then(res => {
  		var that = this;
  		setTimeout(function() {
  			that.hotelService.getAll().then(res => {
          that.hotels = res;
        });
  		}, 200);
  	});
  }

}

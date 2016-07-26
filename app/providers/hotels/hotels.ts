import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '../http-client/http-client'
import { DbService } from '../../providers/db/db';
import { ImageCache } from '../../providers/image-cache/image-cache';



@Injectable()
export class HotelService {
  
  private _db;
  private _hotels;
  imageCache: any;

  url: string = "http://40.76.212.209:8022/umbraco/rest/v1/content/1152/descendants";
  
  constructor(@Inject(DbService) dbService: DbService, imageCache: ImageCache) {
    this._db = dbService;
    this._db.setEntity("hotels");
    this.imageCache = imageCache;
  }

  syncDB() {
    this._db.setEntity("hotels");
    return this._db.sync(this.url);
  }

  destroyDB() {
    this._db.setEntity("hotels");
    this._db.destroy();
  }

  getAll() {
    this._db.setEntity("hotels");
    var that  = this;
    return this._db.getAll().then(res => {
      res.forEach(function(e) {

        if(e.properties.hotelLogo != "null" && typeof e.properties !== "undefined") {
          var img = that.imageCache.showImage(e.properties.hotelLogo).then(res => {
            try {
              e.hotelLogo = that.imageCache._imagesPath+res.url;
            } catch(err) {
              e.hotelLogo = "./imgs/notFound.jpg";
            }
          });
        }
      })
      return Promise.resolve(res);
    });
  }

  remove(id: any) {
    this._db.setEntity("hotels");
    this._db.remove(id);
    return this._hotels = this._db.getAll();
  }
 

}


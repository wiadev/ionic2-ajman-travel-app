import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav, Storage, SqlStorage } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { Page1 } from './pages/page1/page1';
import { Page2 } from './pages/page2/page2';
import { CameraFrame } from './pages/cameraFrame/cameraFrame';
import { Attractions } from './pages/attractions/attractions';
import { Hotels } from './pages/hotels/hotels';

// Providers
import { UserService } from './providers/users/users';
import { HotelService } from './providers/hotels/hotels';
import { HttpClient } from './providers/http-client/http-client';
import { DbService } from './providers/db/db';
import { ImageCache } from './providers/image-cache/image-cache';

@Component({
  templateUrl: 'build/app.html',
  providers: [UserService, HotelService, HttpClient, DbService, ImageCache]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;
  storage: any;
  corptest: any;
  http: any;

  pages: Array<{title: string, component: any}>;

  constructor(private platform: Platform, private userService: UserService, private hotelService: HotelService,  private imageCache: ImageCache) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page uno', component: Page1 },
      { title: 'Page dos', component: Page2 },
      { title: 'Camera', component: CameraFrame },
      { title: 'Attractions', component: Attractions },
      { title: 'Hotels', component: Hotels }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log(window);
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);


import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Loading } from 'ionic-angular';
import { Camera, Base64ToGallery, File } from 'ionic-native';

declare var CameraPreview:any;


@Component({
  templateUrl: 'build/pages/cameraFrame/cameraFrame.html'
})

export class CameraFrame {
 
  image: string;
  platform: any;
  camerapreview: any;
  filewriter: any;
  imageData: any;
  that: any;

  constructor(public nav: NavController, platform: Platform) {
     this.platform = platform;
     this.camerapreview = window['cordova'].plugins.camerapreview;
     this.filewriter = window['FileWriter'];
     var that = this;
     this.platform.ready().then(() => {
       console.log(that.camerapreview);
       // that.camerapreview.setOnPictureTakenHandler(function(result){
       //   console.log(result);
       //  // Base64ToGallery.base64ToGallery(result, 'img_').then(
       //  //   res => { that.imageData = "file://"+res; that.mergeImages(); },
       //  //   err => console.log("Error saving image to gallery ", err)
       //  // ); 
       //  // var contentType = 'image/png';
       //  // var blob = that.b64toBlob(result, contentType);
       //  // var fileWriter = new that.filewriter();
       //  // fileWriter.write('new_pic.jpg', blob, true).then(
       //  //   function(success){
       //  //     console.log('success')
       //  //     console.log(success)
       //  //   },
       //  //   function(error){
       //  //     console.log(error)
       //  //   }
       //  // )
        
       // });
     });
  }

  openCamera() {
    // let options = {
    //     quality: 100,
    //     targetWidth: 1024,
    //     targetHeigh: 1024,
    //     destinationType: Camera.DestinationType.FILE_URI,
    //     encodingType : Camera.EncodingType.JPEG,
    //     correctOrientation: true
    // };
    
    // Camera.getPicture(options).then((imageData) => {
    //   var images = [
    //       imageData,
    //       'imgs/logoFrame.png'
    //   ];
      
    //   window['photojoiner'].join({
    //       'images' : images
    //   });

    // }, (err) => {
    //   console.log(err);
    // });
    var a = this;
    this.platform.ready().then(() => {
      console.log(window);
      // var tapEnabled = true; //enable tap take picture
      // var dragEnabled = true; //enable preview box drag across the screen
      // var toBack = true; //send preview box to the back of the webview
      var rect = {x: 0, y: 0, width: window['device'].width, height: window['device'].height};
      // this.camerapreview.startCamera(rect, "back", tapEnabled, dragEnabled, toBack);

    });
  }

  takePicture() {
    this.camerapreview.takePicture({maxWidth: window['device'].width, maxHeight: window['device'].height});
  }

  mergeImages() {
    console.log(this.imageData);
    var images = [
        this.imageData,
        'imgs/logoFrame.png'
    ];
    
    window['photojoiner'].join({
        'images' : images
    });
    this.camerapreview.stopCamera();
  }

   
}

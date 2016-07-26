import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HttpClient provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HttpClient {

  constructor(private http: Http) {
    this.http = http;
  }

  createAuthorizationHeader(headers:Headers) {
    headers.append('Authorization', 'Bearer OQC5ohMDXw9d78vl9VM4cU4l_hsjJpgQL2dr-g-aSmhCf9-ZoONTT3kFaH4w0xTxTzbPSYaUAZFke6maMaFFDrGmJ-ZjXmk18Fwb74UbM-ulNXqW_Tc3I1_T-tQJs5gVMShsFk7e3-1Y0EGSL7wJ-Ah4z76IOkaVzIdmjOUtziN0GLjcSPACY023ICQBKltIYLPomn2OQBHrBP4h6IeHZiyi4cnMulqVAQqlb1dp2yD7PNmM8mFsEUsokl1U1Jn43HmofWKxl9oZfnbJUHL_DkXvgXEwOxNHzAgC-FElPK3fHRANPNYrG0fH3Fs2Sj2S6tnktY3eE081HVd3PRbqDzUAYrF7coTRzACvM9T8ZQpEEQ2QcEOQ_lJ86x4hUIbf-mRBSxIjc9l2rJ_oHZ3gfyDwabTZyXyi6koHqHUulOSc92JgzoJOMwqshFzs4DG7P4MX9ghg2DOIGRJ6AHI6HRParHXJ2UGD9_O0aciv7Ug3WHdmYwFvJU9TV96PIHUx1aF5ZJt8tIBe21hdU9bbdhBMx4zuInFs1b9PgtZVQ4dfTQdg-QdgndzmuBEWeXIpkH93B-GZvuTgk_l_S1_coVJRbKWPdK0hSP7uOTIu8Ix9dEgHTk2CStf3AoLYwRJxJYPzgfzpF5QKr5YDKCvSy4oScCW7PV1dqN6SN0Pq9anXp9jPsobJQTEYnEyP3pdzeTNquvHgyAzhRF0eVHm3Dlg69m7vFW54hrAOehK8Z812guMKtLacpwd48y3_HnWs7GrC3_umjCEYzM6nBDP8NA'); 
  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

}


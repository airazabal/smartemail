// The backend query service
import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { LoopbackLoginService } from '../auth/loopback/lb-login.service';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const SEARCH_URL = '/api/answerunits/query';

@Injectable()
export class BackendService {
  constructor(private http: Http, private authService:LoopbackLoginService) { }

  post(api_url: string, object: any): Observable<any> {
    console.log('Posting to: '+ api_url);
    let token = this.authService.get().token;
    let urlWithToken = api_url + '?access_token=' + token;

    let params = '';
    let body:any
    if (object) {
      if (object.body) {
        body=object.body
        delete object.body
      }
      Object.keys(object).map((k:string) => {
        params = `${params}&${k}=${encodeURIComponent(object[k])}`
      })
    }

    console.log(params)
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(urlWithToken + params,body, options)
       .catch((error: any) => Observable.throw(error || 'Server error'))
  }

  get(api_url: string, object?: any): Observable<any> {
    console.log('Getting from: '+ api_url);
    let token = this.authService.get().token;
    let urlWithToken = api_url + '?access_token=' + token;
    let params = '';
    if (object) {
      Object.keys(object).map((k:string) => {
        params = `${params}&${k}=${encodeURIComponent(object[k])}`
      })
    }
    console.log(params)
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(urlWithToken + params, options)
       .catch((error: any) => Observable.throw(error || 'Server error'))
  }

  put(api_url: string, object?: any): Observable<any> {
    console.log('Put from: '+ api_url);
    let token = this.authService.get().token;
    let urlWithToken = api_url + '?access_token=' + token;
    let params = '';
    let body:any

    if (object) {
      if (object.body) {
        body=object.body
        delete object.body
      }
      Object.keys(object).map((k:string) => {
        params = `${params}&${k}=${encodeURIComponent(object[k])}`
      })
    }
    console.log('put body is: ', body)
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(urlWithToken + params, body, options)
       .catch((error: any) => Observable.throw(error || 'Server error'))
  }
}

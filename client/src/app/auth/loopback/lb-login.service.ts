/*
# Copyright 2016 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
# limitations under the License.
*/
import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LoopbackLoginService {

  // private instance variable to hold base url
  private loginUrl = '/api/Auth/login';
  private logoutUrl = '/api/Auth/logout';
  private findByIdUrl = '/api/Auth';
  // key used for saving the token in session storage
  private TOKEN_KEY = 'wsl-api-token';
  private USER_ID_KEY = 'wsl-userid';

  // Resolve HTTP using the constructor
  constructor (private http: Http, private router: Router) {}

  // Function that will indicate if a user is logged in or not.
  public isAuthenticated(): Observable<boolean> | boolean {
//    console.log('Is Authenticated called! ')
    let stored = this.get();
    let authenticated;
    if (stored && stored.token && stored.id) {
 //     console.log('Stored is! ',stored)
      let url = this.findByIdUrl + '/' + stored.id + '/accessTokens/' + stored.token + '?access_token=' + stored.token;

      console.log('---------- isAuthenticated() ---------------')
      this.http.get(url)
        .map((res: Response) => {
          console.log('isAuthenticate',res.json())
          console.log('isAuthenticated Response status '+ res.status)
          return true
        }).catch((error:any) => {
          console.log('try 1:isAuthenticated is false...');
          console.log('Response status ',error )
          this.destroyToken();
          return Observable.create(observer => {
            observer.next(false)
            observer.complete()
          });
        }).subscribe((b)=> {
          console.log('b --> ', b)
        })

      console.log('---------- isAuthenticated() try to ---------------')
      return this.http.get(url)
        .map((res: Response) => {
          console.log('isAuthenticate2',res.json())
          console.log('isAuthenticate2 Response status '+ res.status)
          return true
        })
        .catch((error:any) => {
          console.log('isAuthenticated try 2: is false...');
          console.log('Response status ',error )
          this.destroyToken();
          return <Observable<boolean>>Observable.create(observer => {
            observer.next(false)
            observer.complete()
          });
        });
    } else {
      this.router.navigate(['login'])
      return false;
    }
  }

  // Returns an Observable that will make the login request to the server and return the json containing the token
  public login(credentials: any): Observable<any> {
    let bodyString = JSON.stringify(credentials); // Stringify credentials payload
    let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(this.loginUrl, credentials, options) // ...using post request
       .map((res:Response) => {
         this.save(res.json());
         this.router.navigate(['home']);
         return res.json();
       })
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  // Returns an Observable that will make the logout request to the server with the token in session storage
  public logout() : Observable<string> {
    console.log('In Auth Service Logout Function');
    let stored = this.get();
    if (stored && stored.token) {
      let url = this.logoutUrl + '?access_token=' + stored.token;
      let options = new RequestOptions({ }); // Create a request option
      return this.http.post(url, {} ,options)
        .map((res: Response) => {
          this.destroyToken();
          this.router.navigate(['login']);
          return true;
        })
        .catch((err: Response | any) => Observable.throw('Error Loggin Out: ' + err));
    }
  }

  // Remove the token from session storage.
  public destroyToken(): boolean {
    let stored = this.get();
    if (stored) {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_ID_KEY);
      return true;
    }
    return false;
  }

  // Retrieve the api token from the session storage and null if not found
  get() {
    return {
      token: sessionStorage.getItem(this.TOKEN_KEY),
      id: sessionStorage.getItem(this.USER_ID_KEY)
    }
  }

  // Save the token returned from the login response in session storage
  save(credentials: any) {
    if (credentials && credentials.id) {
      sessionStorage.setItem(this.TOKEN_KEY, credentials.id);
      sessionStorage.setItem(this.USER_ID_KEY, credentials.userId);
    }
  }

}

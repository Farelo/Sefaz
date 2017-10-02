import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    login(password: string, username: string): Observable<any> {
      return this.http.get(environment.url + 'user/auth/' + password + '/' + username)
        .map((res: Response) =>  this.auth(res))
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    auth(res: Response) {
        // login successful if there's a jwt token in the response
        let user = res.json().data;
        if (user) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        return user;
    }

    currentUser(){
      return JSON.parse(localStorage.getItem('currentUser'))[0];
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}

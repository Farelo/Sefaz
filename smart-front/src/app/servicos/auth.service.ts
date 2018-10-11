import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {

    //REMOVE
    //url: string = "http://localhost:3000/api"
    
    constructor(private http: HttpClient) { }

    login(password: string, username: string): Observable<any> { 
      //return this.http.get(`${environment.url}profile/auth/${password}/${username}`)
        return this.http.post(`${environment.url}/users/sign_in`, { 'email': username, 'password': password })
        .map(response =>  this.auth(response))
        .catch(this.handleError);
    }
    
    private handleError(error: Response) {
        
        return Observable.throw(error);
    }

    auth(response) {
        // login successful if there's a jwt token in the response
        let user = response;

        if (user) {
          user.token = response.token;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user)); 
        }

        return user;
    }

    currentUser(){
      return JSON.parse(localStorage.getItem('currentUser'));
    }

    updateCurrentUser(){
        var user = JSON.parse(localStorage.getItem('currentUser'))
        
        this.http.get(`${environment.url}profile/recover/${user.password}/${user.email}`)
        .subscribe( (result:any) => {
            var aux = result.data;

            localStorage.setItem('currentUser', JSON.stringify(aux));
        })
       
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}

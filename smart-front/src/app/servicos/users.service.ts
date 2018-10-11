import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Packing } from '../shared/models/packing';
import { environment } from '../../environments/environment';

@Injectable()
export class UsersService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.url}/users`)
      .catch(this.handleError);
  }

  createUser(newUser: any): Observable<any> {
    return this.http.post(`${environment.url}/users`, newUser)
      .catch(this.handleError);
  }

  editUser(userId:any, editUser: any): Observable<any> {
    return this.http.patch(`${environment.url}/users/${userId}`, editUser)
      .catch(this.handleError);
  }

  deleteUser(userId: any): Observable<any> {
    return this.http.delete(`${environment.url}/users/${userId}`)
  .catch(this.handleError);
  }

}
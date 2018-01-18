import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getUserPagination(limit: number, page: number, search: string): Observable<any> {
    return this.http.get(`${environment.url}user/list/pagination/${limit}/${page}?name=${search}`)
      .catch(this.handleError);
  }

  retrieveAll(): Observable<any> {
    return this.http.get(`${environment.url}user/list/all`)
      .catch(this.handleError);
  }

  retrieveUser(id: string): Observable<any>{
    return this.http.get(`${environment.url}user/retrieve/${id}`)
      .catch(this.handleError);
  }

  retrieveUserByEmail(email: string): Observable<any>{
    return this.http.get(`${environment.url}user/retrieve/email/${email}`)
      .catch(this.handleError);
  }

  updateUser(id: string, profile: any): Observable<any>{
    return this.http.put(`${environment.url}user/update/${id}`,profile)
      .catch(this.handleError);
  }

  deleteUser(id: string): Observable<any>{
    return this.http.delete(`${environment.url}user/delete/${id}`)
      .catch(this.handleError);
  }

  createUser(profile: any): Observable<any>{
    return this.http.post(`${environment.url}user/create`, profile)
      .catch(this.handleError);
  }

}

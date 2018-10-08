import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Profile } from '../shared/models/profile';
import { environment } from '../../environments/environment';

@Injectable()
export class ProfileService {

  //REMOVE
  private url: string = "http://localhost:3000/api";
  //private currentUser: any;

  constructor(private http: HttpClient) { 
  }
  
  private handleError(error: Response) {
    return Observable.throw(error);
  }

  getHeaders(): HttpHeaders {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let headers: HttpHeaders = new HttpHeaders().set('Authorization', currentUser.accessToken || '');
    console.log('headers: ' + JSON.stringify(headers));
    
    return headers;
  }

  getUsers() {
    let mHeader: HttpHeaders = this.getHeaders();
    return this.http.get(`${this.url}/users`, { headers: mHeader }).catch(this.handleError);
  }

  getProfilePagination(limit: number, page: number): Observable<any> {

    return this.http.get(`${environment.url}profile/list/pagination/${limit}/${page}`)
      .catch(this.handleError);
  }

  getProfilePaginationSupplier(limit: number, page: number, supplier: string): Observable<any> {
    return this.http.get(`${environment.url}profile/list/pagination/supplier/${limit}/${page}/${supplier}`)
      .catch(this.handleError);
  }

  getProfilePaginationLogistic(limit: number, page: number, logistic: string): Observable<any> {
      return this.http.get(`${environment.url}profile/list/pagination/logistic/${limit}/${page}/${logistic}`)
      .catch(this.handleError);
  }

  retrieveAll(): Observable<any> {
    return this.http.get(`${environment.url}profile/list/all`)
      .catch(this.handleError);
  }

  retrieveProfile(id: string): Observable<any>{
    return this.http.get(`${environment.url}profile/retrieve/${id}`)
      .catch(this.handleError);
  }

  retrieveProfileByEmail(email: string): Observable<any>{
    return this.http.get(`${environment.url}profile/retrieve/email/${email}`)
      .catch(this.handleError);
  }

  updateProfile(id: string, profile: Profile): Observable<any>{
    return this.http.put(`${environment.url}profile/update/${id}`,profile)
      .catch(this.handleError);
  }

  deleteProfile(id: string): Observable<any>{
    return this.http.delete(`${environment.url}profile/delete/${id}`)
      .catch(this.handleError);
  }

  createProfile(profile: Profile): Observable<any>{
    return this.http.post(`${environment.url}profile/create`, profile)
      .catch(this.handleError);
  }

}

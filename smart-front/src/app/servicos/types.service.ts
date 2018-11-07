import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; 
import { environment } from '../../environments/environment';

@Injectable()
export class ControlPointTypesService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getType(typeId): Observable<any> {
    return this.http.get(`${environment.url}/types/${typeId}`)
      .catch(this.handleError);
  }

  getAllType(params: any = {}): Observable<any> {

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    if (queryString) queryString = '?' + queryString;

    return this.http.get(`${environment.url}/types${queryString}`)
      .catch(this.handleError);
  }

  createType(newType: any): Observable<any> {
    return this.http.post(`${environment.url}/types`, newType)
      .catch(this.handleError);
  }

  editType(typeId: any, newType: any): Observable<any> {
    return this.http.patch(`${environment.url}/types/${typeId}`, newType)
      .catch(this.handleError);
  }

  deleteType(typeId: any): Observable<any> {
    return this.http.delete(`${environment.url}/types/${typeId}`)
      .catch(this.handleError);
  }
  
}

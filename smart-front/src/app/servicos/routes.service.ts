import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Route } from '../shared/models/route';
import { environment } from '../../environments/environment';

@Injectable()
export class RoutesService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getRoutesPagination(limit: number, page: number, attr: any): Observable<any> {
    return this.http.get(`${environment.url}route/list/pagination/${limit}/${page}?attr=${attr}`)
      .catch(this.handleError);
  }

  retrieveAll(): Observable<any> {
    return this.http.get(`${environment.url}route/list/all`)
      .catch(this.handleError);
  }

  retrieveRoute(id: string): Observable<any>{
    return this.http.get(`${environment.url}route/retrieve/${id}`)
      .catch(this.handleError);
  }

  updateRoute(id: string, route: Route): Observable<any>{
    return this.http.put(`${environment.url}route/update/${id}`,route)
      .catch(this.handleError);
  }

  deleteRoute(id: string): Observable<any>{
    return this.http.delete(`${environment.url}route/delete/${id}`)
      .catch(this.handleError);
  }

  createRoute(route: Route): Observable<any>{
    return this.http.post(`${environment.url}route/create`, route)
      .catch(this.handleError);
  }

  createRouteArray(array: any): Observable<any>{
    return this.http.post(`${environment.url}route/create/array`, array)
      .catch(this.handleError);
  }

}

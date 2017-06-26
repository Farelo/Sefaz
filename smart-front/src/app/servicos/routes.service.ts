import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Route } from '../shared/models/route';

@Injectable()
export class RoutesService {

  constructor(private http: Http) { }
  //private url = 'http://localhost:8984/api/';
  private url = 'http://isi.pe.senai.br:8984/api/';

  getRoutesPagination(limit: number, page: number): Observable<Route[]> {
    return this.http.get(this.url + 'route/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().routes)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<Route[]> {
    return this.http.get(this.url + 'route/list/all')
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveRoute(id: string): Observable<Route>{
    return this.http.get(this.url + 'route/retrieve/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateRoute(id: string, route: Route): Observable<Route>{
    return this.http.put(this.url + 'route/update/' + id,route)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteRoute(id: string): Observable<Route>{
    return this.http.delete(this.url + 'route/delete/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createRoute(route: Route): Observable<Route>{
    return this.http.post(this.url + 'route/create', route)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

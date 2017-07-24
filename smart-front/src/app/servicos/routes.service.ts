import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Route } from '../shared/models/route';
import { environment } from '../../environments/environment';

@Injectable()
export class RoutesService {

  constructor(private http: Http) { }

  getRoutesPagination(limit: number, page: number): Observable<Route[]> {
    return this.http.get(environment.url + 'route/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().routes)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<Route[]> {
    return this.http.get(environment.url + 'route/list/all')
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveRoute(id: string): Observable<Route>{
    return this.http.get(environment.url + 'route/retrieve/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateRoute(id: string, route: Route): Observable<Route>{
    return this.http.put(environment.url + 'route/update/' + id,route)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteRoute(id: string): Observable<Route>{
    return this.http.delete(environment.url + 'route/delete/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createRoute(route: Route): Observable<Route>{
    return this.http.post(environment.url + 'route/create', route)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

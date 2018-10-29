import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; 
import { environment } from '../../environments/environment';

@Injectable()
export class RoutesService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getRoute(routeId): Observable<any> {
    return this.http.get(`${environment.url}/routes/${routeId}`)
      .catch(this.handleError);
  }

  getAllRoutes(params: any = {}): Observable<any> {

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    if (queryString) queryString = '?' + queryString;

    console.log(queryString);

    return this.http.get(`${environment.url}/routes${queryString}`)
      .catch(this.handleError);
  }

  createRoute(newRoute: any): Observable<any> {
    return this.http.post(`${environment.url}/routes`, newRoute)
      .catch(this.handleError);
  }

  editRoute(routeId: any, newRoute: any): Observable<any> {
    return this.http.patch(`${environment.url}/routes/${routeId}`, newRoute)
      .catch(this.handleError);
  }

  deleteRoute(routeId: any): Observable<any> {
    return this.http.delete(`${environment.url}/routes/${routeId}`)
      .catch(this.handleError);
  }


  /**
   * Rotas antigas
   */

  createRouteArray(newRoute: any): Observable<any> {
    return this.http.post(`${environment.url}/routes`, newRoute)
      .catch(this.handleError);
  }
  
}

import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class ControlPointsService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
    return Observable.throw(error);
  }

  getControlPoint(controlPointId): Observable<any> {
    return this.http.get(`${environment.url}/control_points/${controlPointId}`)
      .catch(this.handleError);
  }

  getAllControlPoint(params: any = {}): Observable<any> {

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    if (queryString) queryString = '?' + queryString;

    return this.http.get(`${environment.url}/control_points${queryString}`)
      .catch(this.handleError);
  }

  createControlPoint(newControlPoint: any): Observable<any> {
    return this.http.post(`${environment.url}/control_points`, newControlPoint)
      .catch(this.handleError);
  }

  editControlPoint(controlPointId: any, newControlPoint: any): Observable<any> {
    return this.http.patch(`${environment.url}/control_points/${controlPointId}`, newControlPoint)
      .catch(this.handleError);
  }

  deleteControlPoint(controlPointId: any): Observable<any> {
    return this.http.delete(`${environment.url}/control_points/${controlPointId}`)
      .catch(this.handleError);
  }

  createControlPointArray(array: any): Observable<any> { 
    return this.http.post(`${environment.url}/control_points/create/array`, array)
      .catch(this.handleError);
  }
}

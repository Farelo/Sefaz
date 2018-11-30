import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GC16 } from '../shared/models/gc16';
import { environment } from '../../environments/environment';

@Injectable()
export class GC16Service {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getGC16(gcId): Observable<any> {
    return this.http.get(`${environment.url}/gc16/${gcId}`)
      .catch(this.handleError);
  }

  getAllGC16(): Observable<any> {
    return this.http.get(`${environment.url}/gc16`)
      .catch(this.handleError);
  }

  createGC16(newGc: any): Observable<any> {
    return this.http.post(`${environment.url}/gc16`, newGc)
      .catch(this.handleError);
  }

  editGC16(gcId: any, newGc: any): Observable<any> {
    return this.http.patch(`${environment.url}/gc16/${gcId}`, newGc)
      .catch(this.handleError);
  }
  
  deleteGC16(gcId: any): Observable<any> {
    return this.http.delete(`${environment.url}/gc16/${gcId}`)
      .catch(this.handleError);
  }

}

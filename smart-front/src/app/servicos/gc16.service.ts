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

  getGC16sPagination(limit: number, page: number, attr: any): Observable<any> {
  return this.http.get(`${environment.url}gc16/list/all/pagination/${limit}/${page}?attr=${attr}`)
      .catch(this.handleError);
  }

  retrieveAll(): Observable<any> {
    return this.http.get(`${environment.url}gc16/list/all`)
      .catch(this.handleError);
  }

  retrieveGC16(id: string): Observable<any>{
    return this.http.get(`${environment.url}gc16/retrieve/${id}`)
      .catch(this.handleError);
  }

  updateGC16(id: string, gc16: GC16): Observable<any>{
    return this.http.put(`${environment.url}gc16/update/${id}`,gc16)
      .catch(this.handleError);
  }

  deleteGC16(id: string): Observable<any>{
    return this.http.delete(`${environment.url}gc16/delete/${id}`)
      .catch(this.handleError);
  }

  createGC16(gc16: GC16): Observable<any>{

    return this.http.post(`${environment.url}gc16/create`, gc16)
      .catch(this.handleError);
  }

}

import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Supplier } from '../shared/models/supplier';
import { environment } from '../../environments/environment';

@Injectable()
export class LogisticService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  listLogistic(limit: any, page: any): Observable<any> {
    return this.http.get(`${environment.url}logistic_operator/list/pagination/${limit}/${page}`)
      .catch(this.handleError);
  }

  retrieveLogistic(id: string): Observable<any>{
    return this.http.get(`${environment.url}logistic_operator/retrieve/${id}`)
      .catch(this.handleError);
  }

  updateLogistic(id: string, logistic: any): Observable<any>{
    return this.http.put(`${environment.url}logistic_operator/update/${id}`,logistic)
      .catch(this.handleError);
  }

  deleteLogistic(id: string, logistic: any): Observable<any>{
    return this.http.delete(`${environment.url}logistic_operator/delete/${id}`)
      .catch(this.handleError);
  }


  createLogistic(logistic: any): Observable<any>{
    return this.http.post(`${environment.url}logistic_operator/create`, logistic)
      .catch(this.handleError);
  }

}

import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Supplier } from '../shared/models/supplier';
import { environment } from '../../environments/environment';

@Injectable()
export class LogisticService {

  constructor(private http: Http) { }


  retrieveLogistic(id: string): Observable<any>{
    return this.http.get(environment.url + 'logistic_operator/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


  updateLogistic(id: string, logistic: any): Observable<any>{
    return this.http.put(environment.url + 'logistic_operator/update/' + id,logistic)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteLogistic(id: string, logistic: any): Observable<any>{
    return this.http.delete(environment.url + 'logistic_operator/delete/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


  createLogistic(logistic: any): Observable<any>{
    return this.http.post(environment.url + 'logistic_operator/create', logistic)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Alert } from '../shared/models/alert';
import { environment } from '../../environments/environment';

@Injectable()
export class AlertsService {

  constructor(private http: Http) { }


  getAlerts(limit: number, page: number, attr: string = ''): Observable<any> {

    return this.http.get(environment.url + 'alert/list/pagination/' + limit + '/' + page + '?attr='+ attr )
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAlertsLogistic(limit: number, page: number, array: any): Observable<any> {

    return this.http.post(environment.url + 'alert/list/pagination/logistic/' + limit + '/' + page, array )
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAlertsPaginationByHashing(limit: number, page: number, code: string, project: string , supplier: string, status:string, attr: string = ''): Observable<any> {

    return this.http.get(environment.url + 'alert/list/all/packing/' + limit + '/' + page + '/' + code +'/'+project + '/' + supplier +'/'+status + '?attr='+ attr )
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAlertsPaginationByHashingLogistic(limit: number, page: number, code: string, project: string , supplier: string, status:string, array: any): Observable<any> {
    console.log(array);
    return this.http.post(environment.url + 'alert/list/all/packing/logistic/' + limit + '/' + page + '/' + code +'/'+project + '/' + supplier +'/'+status, array )
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAlertByPacking(id: string, status: number): Observable<any>{
    return this.http.get(environment.url + 'alert/retrieve/' + id + '/' + status)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

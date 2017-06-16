import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Alert } from '../shared/models/alert';

@Injectable()
export class AlertsService {

  constructor(private http: Http) { }
  private url = 'http://localhost:8080/api/';


  getAlertsPagination(limit: number, page: number): Observable<Alert[]> {

    return this.http.get(this.url + 'alert/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAlertsPaginationByHashing(limit: number, page: number, hashing: string, status:string): Observable<Alert[]> {

    return this.http.get(this.url + 'alert/list/all/hashing/' + limit + '/' + page + '/' + hashing +'/'+status)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAlertByPacking(id: string): Observable<Alert>{
    return this.http.get(this.url + 'alert/retrieve/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

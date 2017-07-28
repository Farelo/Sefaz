import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Alert } from '../shared/models/alert';
import { environment } from '../../environments/environment';

@Injectable()
export class AlertsService {

  constructor(private http: Http) { }


  getAlertsPagination(limit: number, page: number): Observable<any> {

    return this.http.get(environment.url + 'alert/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAlertsPaginationByHashing(limit: number, page: number, hashing: string, status:string): Observable<any> {

    return this.http.get(environment.url + 'alert/list/all/hashing/' + limit + '/' + page + '/' + hashing +'/'+status)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAlertByPacking(id: string): Observable<any>{
    return this.http.get(environment.url + 'alert/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

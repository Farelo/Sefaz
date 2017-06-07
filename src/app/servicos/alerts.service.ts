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
      .map((res: Response) => res.json().alerts)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

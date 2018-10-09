import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Packing } from '../shared/models/packing';
import { environment } from '../../environments/environment';

@Injectable()
export class UsersService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.url}users`)
      .catch(this.handleError);
  }

}
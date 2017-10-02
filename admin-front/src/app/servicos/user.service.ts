import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  getUserPagination(limit: number, page: number, search: string): Observable<any> {
    return this.http.get(environment.url + 'user/list/pagination/' + limit + '/' + page +"?name="+search)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<any> {
    return this.http.get(environment.url + 'user/list/all')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveUser(id: string): Observable<any>{
    return this.http.get(environment.url + 'user/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveUserByEmail(email: string): Observable<any>{
    return this.http.get(environment.url + 'user/retrieve/email/' + email)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateUser(id: string, profile: any): Observable<any>{
    return this.http.put(environment.url + 'user/update/' + id,profile)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteUser(id: string): Observable<any>{
    return this.http.delete(environment.url + 'user/delete/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createUser(profile: any): Observable<any>{
    return this.http.post(environment.url + 'user/create', profile)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(console.log(error.json())));
  }

}

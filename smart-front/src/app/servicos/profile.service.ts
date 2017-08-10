import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Profile } from '../shared/models/profile';
import { environment } from '../../environments/environment';

@Injectable()
export class ProfileService {

  constructor(private http: Http) { }

  getProfilePagination(limit: number, page: number): Observable<any> {
    return this.http.get(environment.url + 'profile/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<any> {
    return this.http.get(environment.url + 'profile/list/all')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveProfile(id: string): Observable<any>{
    return this.http.get(environment.url + 'profile/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateProfile(id: string, profile: Profile): Observable<any>{
    return this.http.put(environment.url + 'profile/update/' + id,profile)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteProfile(id: string): Observable<any>{
    return this.http.delete(environment.url + 'profile/delete/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createProfile(profile: Profile): Observable<any>{
    return this.http.post(environment.url + 'profile/create', profile)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(console.log(error.json())));
  }

}

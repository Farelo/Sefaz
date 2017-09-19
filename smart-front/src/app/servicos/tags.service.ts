import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Tag } from '../shared/models/tag';
import { environment } from '../../environments/environment';

@Injectable()
export class TagsService {

  constructor(private http: Http) { }

  getTagsPagination(limit: number, page: number, attr: any): Observable<any> {
    return this.http.get(environment.url + 'tags/list/pagination/' + limit + '/' + page+ '?attr='+ attr)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAllNoBinded(): Observable<any> {
    return this.http.get(environment.url + 'tags/list/all/nobinded')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveTag(id: string): Observable<any>{
    return this.http.get(environment.url + 'tags/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveTagByMac(id: string): Observable<any>{
    return this.http.get(environment.url + 'tags/retrieve/mac/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateTag(id: string, tag: Tag): Observable<any>{
    return this.http.put(environment.url + 'tags/update/' + id,tag)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteTag(id: string): Observable<any>{
    return this.http.delete(environment.url + 'tags/delete/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createTag(tag: Tag): Observable<any>{
    return this.http.post(environment.url + 'tags/create', tag)
      .map((res: Response) => {console.log(res.json())})
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createTagArray(array: any): Observable<any>{
    return this.http.post(environment.url + 'tags/create/array', array)
      .map((res: Response) => {console.log(res.json())})
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }




}

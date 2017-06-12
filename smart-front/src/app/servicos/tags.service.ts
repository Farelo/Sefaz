import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Tag } from '../shared/models/tag';

@Injectable()
export class TagsService {

  constructor(private http: Http) { }
  private url = 'http://localhost:8080/api/';


  getTagsPagination(limit: number, page: number): Observable<Tag[]> {
    return this.http.get(this.url + 'tags/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().tags)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAllNoBinded(): Observable<Tag[]> {
    return this.http.get(this.url + 'tags/list/all/nobinded/')
      .map((res: Response) => res.json().tags)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveTag(id: string): Observable<Tag>{
    return this.http.get(this.url + 'tags/retrieve/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveTagByMac(id: string): Observable<Tag>{
    return this.http.get(this.url + 'tags/retrieve/mac/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateTag(id: string, tag: Tag): Observable<Tag>{
    return this.http.put(this.url + 'tags/update' + id,tag)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteTag(id: string): Observable<Tag>{
    return this.http.delete(this.url + 'tags/delete' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createTag(tag: Tag[]): Observable<Tag>{
    return this.http.post(this.url + 'tags/create', tag)
      .map((res: Response) => {console.log(res.json())})
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }




}

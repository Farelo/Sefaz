import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Tag } from '../shared/models/tag';
import { environment } from '../../environments/environment';

@Injectable()
export class TagsService {

  url: string = "http://localhost:3000/api/"

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getTagsPagination(limit: number, page: number, attr: any): Observable<any> {
    return this.http.get(`${this.url}tags/list/pagination/${limit}/${page}?attr=${attr}`)
      .catch(this.handleError);
  }

  retrieveAllNoBinded(): Observable<any> {
    return this.http.get(`${environment.url}tags/list/all/nobinded`)
      .catch(this.handleError);
  }

  retrieveTag(id: string): Observable<any>{
    return this.http.get(`${environment.url}tags/retrieve/${id}`)
      .catch(this.handleError);
  }

  retrieveTagByMac(id: string): Observable<any>{
    return this.http.get(`${environment.url}tags/retrieve/mac/${id}`)
      .catch(this.handleError);
  }

  updateTag(id: string, tag: Tag): Observable<any>{
    return this.http.put(`${environment.url}tags/update/${id}`,tag)
      .catch(this.handleError);
  }

  deleteTag(id: string): Observable<any>{
    return this.http.delete(`${environment.url}tags/delete/${id}`)
      .catch(this.handleError);
  }

  createTag(tag: Tag): Observable<any>{
    return this.http.post(`${environment.url}tags/create`, tag)
      .catch(this.handleError);
  }

  createTagArray(array: any): Observable<any>{
    return this.http.post(`${environment.url}tags/create/array`, array)
      .catch(this.handleError);
  }


}

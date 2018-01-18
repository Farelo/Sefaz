import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Project } from '../shared/models/project';
import { environment } from '../../environments/environment';

@Injectable()
export class ProjectService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getProjectPagination(limit: number, page: number, attr: any): Observable<any> {
    return this.http.get(`${environment.url}project/list/pagination/${limit}/${page}?attr=${attr}`)
      .catch(this.handleError);
  }

  retrieveAll(): Observable<any> {
    return this.http.get(`${environment.url}project/list/all`)
      .catch(this.handleError);
  }

  retrieveProject(id: string): Observable<any>{
    return this.http.get(`${environment.url}project/retrieve/${id}`)
      .catch(this.handleError);
  }

  updateProject(id: string, project: Project): Observable<any>{
    return this.http.put(`${environment.url}project/update/${id}`,project)
      .catch(this.handleError);
  }

  deleteProject(id: string): Observable<any>{
    return this.http.delete(`${environment.url}project/delete/${id}`)
      .catch(this.handleError);
  }

  createProject(project: Project): Observable<any>{
    return this.http.post(`${environment.url}project/create`, project)
      .catch(this.handleError);
  }

  createProjectArray(array: any): Observable<any>{
    return this.http.post(`${environment.url}project/create/array`, array)
      .catch(this.handleError);
  }

}

import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Project } from '../shared/models/project';
import { environment } from '../../environments/environment';

@Injectable()
export class ProjectService {

  constructor(private http: Http) { }

  getProjectPagination(limit: number, page: number): Observable<any> {
    return this.http.get(environment.url + 'project/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<any> {
    return this.http.get(environment.url + 'project/list/all')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveProject(id: string): Observable<any>{
    return this.http.get(environment.url + 'project/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateProject(id: string, project: Project): Observable<any>{
    return this.http.put(environment.url + 'project/update/' + id,project)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteProject(id: string): Observable<any>{
    return this.http.delete(environment.url + 'project/delete/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createProject(project: Project): Observable<any>{
    return this.http.post(environment.url + 'project/create', project)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

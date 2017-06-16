import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Project } from '../shared/models/project';

@Injectable()
export class ProjectService {

  constructor(private http: Http) { }
  private url = 'http://localhost:8080/api/';


  getProjectPagination(limit: number, page: number): Observable<Project[]> {
    return this.http.get(this.url + 'project/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().projects)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<Project[]> {
    return this.http.get(this.url + 'project/list/all')
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveProject(id: string): Observable<Project>{
    return this.http.get(this.url + 'project/retrieve/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateProject(id: string, project: Project): Observable<Project>{
    return this.http.put(this.url + 'project/update/' + id,project)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteProject(id: string): Observable<Project>{
    return this.http.delete(this.url + 'project/delete/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createProject(project: Project): Observable<Project>{
    return this.http.post(this.url + 'project/create', project)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

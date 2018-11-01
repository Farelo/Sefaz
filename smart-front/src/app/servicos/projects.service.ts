import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; 
import { environment } from '../../environments/environment';

@Injectable()
export class ProjectService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getProject(projectId): Observable<any> {
    return this.http.get(`${environment.url}/projects/${projectId}`)
      .catch(this.handleError);
  }

  getAllProjects(params: any = {}): Observable<any> {

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    if (queryString) queryString = '?' + queryString;

    return this.http.get(`${environment.url}/projects${queryString}`)
      .catch(this.handleError);
  }

  createProject(newProject: any): Observable<any> {
    return this.http.post(`${environment.url}/projects`, newProject)
      .catch(this.handleError);
  }

  editProject(projectId: any, newProject: any): Observable<any> {
    return this.http.patch(`${environment.url}/projects/${projectId}`, newProject)
      .catch(this.handleError);
  }

  deleteProject(projectId: any): Observable<any> {
    return this.http.delete(`${environment.url}/projects/${projectId}`)
      .catch(this.handleError);
  }


  /**
   * Métodos legados
   */

  createProjectArray(data: any){
    return this.http.get(`${environment.url}/projects`)
      .catch(this.handleError);
  }
}

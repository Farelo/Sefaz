import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Department } from '../shared/models/department';
import { environment } from '../../environments/environment';

@Injectable()
export class DepartmentService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getDepartmentsPagination(limit: number, page: number, attr:any): Observable<any> {
    return this.http.get(`${environment.url}department/list/pagination/${limit}/${page}?attr=${attr}`)
      .catch(this.handleError);
  }

  retrieveAll(): Observable<any> {
    return this.http.get(`${environment.url}department/list/all`)
      .catch(this.handleError);
  }

  retrieveByPlants(limit: number, page: number, id: string): Observable<any> {
    return this.http.get(`${environment.url}department/list/pagination/${limit}/${page}/plant/${id}`)
      .catch(this.handleError);
  }

  retrieveDepartment(id: string): Observable<any>{
    return this.http.get(`${environment.url}department/retrieve/${id}`)
      .catch(this.handleError);
  }

  updateDepartment(id: string, department: Department): Observable<any>{
    return this.http.put(`${environment.url}department/update/${id}`,department)
      .catch(this.handleError);
  }

  deleteDepartment(id: string): Observable<any>{
    return this.http.delete(`${environment.url}department/delete/${id}`)
      .catch(this.handleError);
  }

  createDepartment(department: any): Observable<any>{
    return this.http.post(`${environment.url}department/create`, department)
      .catch(this.handleError);
  }

  createDepartmentArray(array: any): Observable<any>{
    return this.http.post(`${environment.url}department/create/array`, array)
      .catch(this.handleError);
  }

}

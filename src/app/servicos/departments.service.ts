import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Department } from '../shared/models/department';

@Injectable()
export class DepartmentService {

  constructor(private http: Http) { }
  private url = 'http://localhost:8080/api/';


  getDepartmentsPagination(limit: number, page: number): Observable<Department[]> {
    return this.http.get(this.url + 'department/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().departments)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<Department[]> {
    return this.http.get(this.url + 'department/list/all')
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveDepartment(id: string): Observable<Department>{
    return this.http.get(this.url + 'department/retrieve/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateDepartment(id: string, tag: Department): Observable<Department>{
    return this.http.put(this.url + 'department/update' + id,tag)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteDepartment(id: string): Observable<Department>{
    return this.http.delete(this.url + 'department/delete' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createDepartment(tag: Department): Observable<Department>{
    return this.http.post(this.url + 'department/create', tag)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

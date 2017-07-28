import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Department } from '../shared/models/department';
import { environment } from '../../environments/environment';

@Injectable()
export class DepartmentService {

  constructor(private http: Http) { }

  getDepartmentsPagination(limit: number, page: number): Observable<any> {
    return this.http.get(environment.url + 'department/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<any> {
    return this.http.get(environment.url + 'department/list/all')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveByPlants(): Observable<any> {
    return this.http.get(environment.url + 'department/list/department/plant')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveDepartment(id: string): Observable<any>{
    return this.http.get(environment.url + 'department/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateDepartment(id: string, department: Department): Observable<any>{
    return this.http.put(environment.url + 'department/update/' + id,department)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteDepartment(id: string): Observable<any>{
    return this.http.delete(environment.url + 'department/delete/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createDepartment(department: Department): Observable<any>{
    return this.http.post(environment.url + 'department/create', department)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

import { Injectable }     from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; 
import { environment } from '../../environments/environment';

@Injectable()
export class DepartmentService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getDepartment(departmentId): Observable<any> {
    return this.http.get(`${environment.url}/departments/${departmentId}`)
      .catch(this.handleError);
  }

  getAllDepartment(params: any = {}): Observable<any> {

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    if (queryString) queryString = '?' + queryString;

    return this.http.get(`${environment.url}/departments${queryString}`)
      .catch(this.handleError);
  }

  createDepartment(newDepartment: any): Observable<any> {
    return this.http.post(`${environment.url}/departments`, newDepartment)
      .catch(this.handleError);
  }

  editDepartment(departmentId: any, newDepartment: any): Observable<any> {
    return this.http.patch(`${environment.url}/departments/${departmentId}`, newDepartment)
      .catch(this.handleError);
  }

  deleteDepartment(departmentId: any): Observable<any> {
    return this.http.delete(`${environment.url}/departments/${departmentId}`)
      .catch(this.handleError);
  }
  
  /**
   * LEgado
   */
  createDepartmentArray(param: any){
    return this.http.get(`${environment.url}/departments/${param}`)
      .catch(this.handleError);
  }

  retrieveByPlants(limit: number, page: number, id: string): Observable<any> {
    return this.http.get(`${environment.url}/departments/${id}`)
      .catch(this.handleError);
  }
}

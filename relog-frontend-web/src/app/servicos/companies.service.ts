import { Injectable }     from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class CompaniesService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getCompany(companyID): Observable<any> {
    return this.http.get(`${environment.url}/companies/${companyID}`)
      .catch(this.handleError);
  }

  getAllCompanies(): Observable<any> {
    return this.http.get(`${environment.url}/companies`)
      .catch(this.handleError);
  }

  createCompany(newCompany: any): Observable<any> {
    return this.http.post(`${environment.url}/companies`, newCompany)
      .catch(this.handleError);
  }

  editCompany(companyId: any, newCompany: any): Observable<any> {
    return this.http.patch(`${environment.url}/companies/${companyId}`, newCompany)
      .catch(this.handleError);
  }
  
  deleteCompany(companyId: any): Observable<any> {
    return this.http.delete(`${environment.url}/companies/${companyId}`)
      .catch(this.handleError);
  }

  createCompanyArray(array: any): Observable<any> {
    return this.http.post(`${environment.url}/companies/create/array`, array)
      .catch(this.handleError);
  }
}
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

  getAllCompanies(): Observable<any> {
    return this.http.get(`${environment.url}/companies`)
      .catch(this.handleError);
  }

  createCompany(newCompany: any): Observable<any> {
    return this.http.post(`${environment.url}/companies`, newCompany)
      .catch(this.handleError);
  }

  deleteCompany(companyId: any): Observable<any> {
    return this.http.delete(`${environment.url}/companies/${companyId}`)
      .catch(this.handleError);
  }

}
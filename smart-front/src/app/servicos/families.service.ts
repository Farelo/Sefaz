import { Injectable }     from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class FamiliesService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getFamily(familyID): Observable<any> {
    return this.http.get(`${environment.url}/families/${familyID}`)
      .catch(this.handleError);
  }

  getAllFamilies(): Observable<any> {
    return this.http.get(`${environment.url}/families`)
      .catch(this.handleError);
  }

  createFamily(newFamily: any): Observable<any> {
    return this.http.post(`${environment.url}/families`, newFamily)
      .catch(this.handleError);
  }

  editFamily(familyID: any, newFamily: any): Observable<any> {
    return this.http.patch(`${environment.url}/families/${familyID}`, newFamily)
      .catch(this.handleError);
  }
  
  deleteFamily(familyID: any): Observable<any> {
    return this.http.delete(`${environment.url}/families/${familyID}`)
      .catch(this.handleError);
  }

}
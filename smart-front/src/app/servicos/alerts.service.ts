import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Alert } from '../shared/models/alert';
import { environment } from '../../environments/environment';


@Injectable()
export class AlertsService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
    return Observable.throw(error);
  }

  getAllAlerts(): Observable<any> {

    return this.http.get(`${environment.url}/alerts`).catch(this.handleError);
  }

  getAlertsByFamily(family_id: number, current_state: number): Observable<any> {

    return this.http.get(`${environment.url}/alerts/${family_id}/${current_state}`).catch(this.handleError);
  }











  getAlerts(limit: number, page: number, attr: string = ''): Observable<any> {

    return this.http.get(`${environment.url}alert/list/pagination/${limit}/${page}?attr=${attr}`)
      .catch(this.handleError);
  }

  getAlertsLogistic(limit: number, page: number, array: any): Observable<any> {

    return this.http.post(`${environment.url}alert/list/pagination/logistic/${limit}/${page}`, array)
      .catch(this.handleError);
  }

  getAlertsPaginationByHashing(limit: number, page: number, code: string, project: string, supplier: string, status: string, attr: string = ''): Observable<any> {

    return this.http.get(`${environment.url}alert/list/all/packing/${limit}/${page}/${code}/${project}/${supplier}/${status}?attr=${attr}`)
      .catch(this.handleError);
  }

  getAlertsPaginationByHashingLogistic(limit: number, page: number, code: string, project: string, supplier: string, status: string, array: any): Observable<any> {

    return this.http.post(`${environment.url}alert/list/all/packing/logistic/${limit}/${page}/${code}/${project}/${supplier}/${status}`, array)
      .catch(this.handleError);
  }

  retrieveAlertByPacking(id: string, status: number): Observable<any> {
    return this.http.get(`${environment.url}alert/retrieve/${id}/${status}`)
      .catch(this.handleError);
  }

  retrievePackingAlert(packing_id: string) {
    return this.http.get(`${environment.url}alerts/packing/${packing_id}`)
      .catch(this.handleError);
  }

}

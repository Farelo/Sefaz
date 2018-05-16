import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class InventoryLogisticService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getInventoryGeneral(limit: number, page: number, array: any): Observable<any> {

    return this.http.post(`${environment.url}inventory/logistic/general/${limit}/${page}`, array)
      .catch(this.handleError);
  }

  getInventoryGeneralPackings(limit: number, page: number, code: string, array: any): Observable<any> {
    return this.http.post(`${environment.url}inventory/logistic/general/packings/${limit}/${page}?code=${code}`, array)
      .catch(this.handleError);
  }

  getInventoryPermanence(limit: number, page: number, code: string, array: any): Observable<any> {

    return this.http.post(`${environment.url}inventory/logistic/permanence/${limit}/${page}/${code}`, array)
      .catch(this.handleError);
  }

  getInventoryQuantity(limit: number, page: number, code: string, array: any): Observable<any> {

    return this.http.post(`${environment.url}inventory/logistic/quantity/${limit}/${page}/${code}`, array)
      .catch(this.handleError);
  }

  getInventoryPackingHistoric(limit: number, page: number, serial: string, code: string, array: any): Observable<any> {

    return this.http.post(`${environment.url}inventory/logistic/packing/historic/${limit}/${page}/${serial}/${code}`, array)
      .catch(this.handleError);
  }

  getInventoryBattery(limit: number, page: number, code: string, array: any): Observable<any> {

    return this.http.post(`${environment.url}inventory/logistic/battery/${limit}/${page}?code=${code}` , array )
      .catch(this.handleError);
  }


  getInventorySupplierByPlantAnd(limit: number, page: number, code: string, supplier: string, project: string): Observable<any> {

    return this.http.get(`${environment.url}inventory/plant/${limit}/${page}/${code}/${supplier}/${project}`)
      .catch(this.handleError);
  }

  /**
   * Emanoel
   */
  getDetailedGeneralInventory(limit: number, page: number, code: string, supplier: string, project: string): Observable<any> {
    return null;
  }

}

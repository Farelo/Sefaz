import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class InventoryService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getInventoryGeneral(limit: number, page: number, attr: string = ''): Observable<any> {

    return this.http.get(`${environment.url}inventory/general/${limit}/${page}?attr=${attr}`)
      .catch(this.handleError);
  }

  getInventoryGeneralPackings(limit: number, page: number, code: string, attr: string = ''): Observable<any> {
    return this.http.get(`${environment.url}inventory/general/packings/${limit}/${page}?code=${code}&attr=${attr}`)
      .catch(this.handleError);
  }

  getInventoryPermanence(limit: number, page: number, code: string, attr: string = ''): Observable<any> {

    return this.http.get(`${environment.url}inventory/permanence/${limit}/${page}/${code}?attr=${attr}`)
      .catch(this.handleError);
  }

  getAbsencePermanence(limit: number, page: number, code: string, time: number = 10, serial: string = '', plant: string = ''): Observable<any> {
    return this.http.get(`${environment.url}inventory/absence/${limit}/${page}/${code}?serial=${serial}&time=${time}&plant=${plant}`)
      .catch(this.handleError);
  }

  getInventoryQuantity(limit: number, page: number, code: string, attr: string = ''): Observable<any> {

    return this.http.get(`${environment.url}inventory/quantity/${limit}/${page}/${code}?attr=${attr}`)
      .catch(this.handleError);
  }

  getInventoryPackingHistoric(limit: number, page: number, serial: string, code: string, attr: string = ''): Observable<any> {

    return this.http.get(`${environment.url}inventory/packing/historic/${limit}/${page}/${serial}/${code}?attr=${attr}`)
      .catch(this.handleError);
  }

  getInventoryAbsencePacking(limit: number, page: number, serial: string, code: string, attr: string = ''): Observable<any> {
    return this.http.get(`${environment.url}inventory/packing/absence/${limit}/${page}/${serial}/${code}?attr=${attr}`)
      .catch(this.handleError);
  }

  getInventoryBattery(limit: number, page: number, code: string, attr: string = ''): Observable<any> {

    return this.http.get(`${environment.url}inventory/battery/${limit}/${page}?code=${code}&attr=${attr}`)
      .catch(this.handleError);
  }

  getInventorySupplier(limit: number, page: number, supplier: string): Observable<any> {

    return this.http.get(`${environment.url}inventory/supplier/${limit}/${page}/${supplier}`)
      .catch(this.handleError);
  }

  getInventorySupplierByPlantAnd(limit: number, page: number, code: string, supplier: string, project: string): Observable<any> {

    return this.http.get(`${environment.url}inventory/plant/${limit}/${page}/${code}/${supplier}/${project}`)
      .catch(this.handleError);
  }

  /** ########################################### 
   * Emanoel
   */

  /**
   * Get all the data to populate the csv file
   */
  getDataToCsv(params): Observable<any>{
    var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    if (queryString){ queryString = '?' + queryString; }
    
    console.log('queryString: ' + queryString);
    
    return this.http.get(`${environment.url}inventory/detailed/csv${queryString}`)
      .catch(this.handleError);
  }

  /**
   * Populate the detailed table with pagination
   * @param limit The number of results per page
   * @param page  The actual page
   */
  getDetailedGeneralInventory(limit: number, page: number): Observable<any> {
    return this.http.get(`${environment.url}inventory/detailed/${limit}/${page}`)
      .catch(this.handleError);
  }

  /**
   * Populate the detailed table with supplier filter
   * @param limit The number of results per page
   * @param page  The actual page
   * @param supplier The supplier code
   */
  getDetailedGeneralInventoryBySupplier(limit: number, page: number, supplier: string): Observable<any> {
    return null;
  }

  /**
   * Populate the detailed table with supplier and equipment filter
   * @param limit The number of results per page
   * @param page  The actual page
   * @param supplier The supplier code
   * @param code The equipment code
   */
  getDetailedGeneralInventoryBySupplierAndEquipment(limit: number, page: number, supplier: string, code: string): Observable<any> {
    return null;
  }

}

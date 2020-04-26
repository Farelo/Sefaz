import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Packing } from '../shared/models/packing';
import { environment } from '../../environments/environment';

@Injectable()
export class PackingService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getPacking(packingId): Observable<any> {
    return this.http.get(`${environment.url}/packings/${packingId}`)
      .catch(this.handleError);
  }

  getAllPackings(params: any = {}): Observable<any> {

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    if (queryString) queryString = '?' + queryString;
    
    return this.http.get(`${environment.url}/packings${queryString}`)
      .catch(this.handleError);
  }

  createPacking(newPacking: any): Observable<any> {
    return this.http.post(`${environment.url}/packings`, newPacking)
      .catch(this.handleError);
  }

  editPacking(packingId: any, newPacking: any): Observable<any> {
    return this.http.patch(`${environment.url}/packings/${packingId}`, newPacking)
      .catch(this.handleError);
  }

  deletePacking(packingId: any): Observable<any> {
    return this.http.delete(`${environment.url}/packings/${packingId}`)
      .catch(this.handleError);
  }

  packingsOnControlPoint(controlPointId: any): Observable<any> {
    return this.http.get(`${environment.url}/packings/on_control_point/${controlPointId}`)
      .catch(this.handleError);
  }

  createPackingArray(array: any): Observable<any> { 
    return this.http.post(`${environment.url}/packings/create_many`, array)
      .catch(this.handleError);
  }




  /**
   * 
   * @param limit Rotas antigas
   * @param page 
   * @param attr 
   */
  getPackingsPagination(limit: number, page: number, attr: any): Observable<any> {
    return this.http.get(`${environment.url}/packing/list/pagination/${limit}/${page}?attr=${attr}`)
      .catch(this.handleError);
  }

  getInventoryPagination(limit: number, page: number): Observable<any> {
    return this.http.get(`${environment.url}/packing/list/inventory/pagination/${limit}/${page}`)
      .catch(this.handleError);
  }

  getBySupplier(id: string): Observable<any> {
    return this.http.get(`${environment.url}/packing/list/supplier/${id}`)
      .catch(this.handleError);
  }

  getPositions(code: string): Observable<any> {
    return this.http.get(`${environment.url}/packing/position/${code}`)
      .catch(this.handleError);
  }

  getPackingsByCode(id): Observable<any> {
    return this.http.get(`${environment.url}/packing/list/code/${id}`)
      .catch(this.handleError);
  }
 
  getPackingsEquals(supplier: string, project: string, code: string): Observable<any> {
    return this.http.get(`${environment.url}/packing/list/equals/${supplier}/${project}/${code}`)
      .catch(this.handleError);
  }

  getPackingsDistincts(): Observable<any> {
    return this.http.get(`${environment.url}/packing/list/distinct`)
      .catch(this.handleError);
  }

  getPackingsDistinctsByLogistic(array: any): Observable<any> {
    return this.http.post(`${environment.url}/packing/list/distinct/logistic`, array)
      .catch(this.handleError);
  }

  getPackingsDistinctsBySupplier(supplier: string): Observable<any> {
    return this.http.get(`${environment.url}/packing/list/distinct/suplier/${supplier}`)
      .catch(this.handleError);
  }

  getPackingsByDepartment(id: string,limit: number, page: number): Observable<any> {
    return this.http.get(`${environment.url}/packing/list/department/${id}/${limit}/${page}`)
      .catch(this.handleError);
  }

  getPackingsByPackingCode(code: string, limit: number, page: number){
    return this.http.get(`${environment.url}/packing/list/distinct/${code}/${limit}/${page}`)
      .catch(this.handleError);
  }

  retrieveByPlants(limit: number, page: number, id: string): Observable<any> {
    return this.http.get(`${environment.url}/packing/list/pagination/${limit}/${page}/plant/${id}`)
      .catch(this.handleError);
  }

  retrieveAllNoBinded(supplier: any): Observable<any> {

    return this.http.get(`${environment.url}/packing/list/all/nobinded/${supplier}`)
      .catch(this.handleError);
  }

  retrievePacking(id: string): Observable<any>{
    return this.http.get(`${environment.url}/packing/retrieve/${id}`)
      .catch(this.handleError);
  }

  retrievePackingByCodeAndSerial(code: string,serial: string): Observable<any>{
    return this.http.get(`${environment.url}/packing/retrieve/code/${code}/serial/${serial}`)
      .catch(this.handleError);
  }

  retrievePackingBySupplierAndCodeAndProject(code: string,supplier: string, project: string): Observable<any>{
    return this.http.get(`${environment.url}/packing/retrieve/code/${code}/supplier/${supplier}/project/${project}`)
      .catch(this.handleError);
  }


  retrieveInventory(limit: number, page: number): Observable<any>{
    return this.http.get(`${environment.url}/packing/list/inventory/pagination/${limit}/${page}`)
      .catch(this.handleError);
  }

  // updatePacking(id: string, packing: any): Observable<any>{
  //   return this.http.put(`${environment.url}/packing/update/${id}`,packing)
  //     .catch(this.handleError);
  // }

  updatePackingByGC16(code: string,supplier: string,project: string, packing: any): Observable<any>{
    return this.http.put(`${environment.url}/packing/update/gc16/${code}/${supplier}/${project}`,packing)
      .catch(this.handleError);
  }

  updatePackingUnset(id: string): Observable<any>{
    return this.http.put(`${environment.url}/packing/update/unset/${id}`,{})
      .catch(this.handleError);
  }

  updateAllPacking(code: string, supplier: string, packing: any): Observable<any>{
    return this.http.put(`${environment.url}/packing/update/all/${code}/${supplier}`,packing)
      .catch(this.handleError);
  }

  // deletePacking(id: string): Observable<any>{
  //   return this.http.delete(`${environment.url}/packing/delete/${id}`)
  //     .catch(this.handleError);
  // }

  // createPacking(tag: Packing []): Observable<any>{
  //   return this.http.post(`${environment.url}/packing/create`, tag)
  //     .catch(this.handleError);
  // }

  

  loadingPackingPerPlant(limit: number, page: number): Observable<any>{
    return this.http.get(`${environment.url}/packing/list/quantiy/per/plant/${limit}/${page}`)
      .catch(this.handleError);
  }

  loadingPackingPerCondition(): Observable<any>{
    return this.http.get(`${environment.url}/packing/quantity/per/condition`)
      .catch(this.handleError);
  }

  //
  /**
   * This method retrieves the packing positions that matches the 'initial date', 'final date' and 'max accuracy error'.
   * If final date isn't given, then consider finalDate = today, because there is no position generated from tomorrow. :)
   * 
   * @param code The package code
   * @param initialDate The first date to generate position in the map
   * @param finalDate The last  date to generate position in the map
   * @param accuracy The max accuracy error
   * 
   */
  getFilteredPositions(code: string, initialDate: number, finalDate: number): Observable<any> {
    return this.http.get(`${environment.url}/packing/position/${code}?initial_date=${initialDate}&final_date=${finalDate}`)
      .catch(this.handleError);
  }

}

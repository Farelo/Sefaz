import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; 
import { environment } from '../../environments/environment';

@Injectable()
export class RackService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getRack(rackId): Observable<any> {
    return this.http.get(`${environment.url}/racks/${rackId}`)
      .catch(this.handleError);
  }

  getAllRacks(params: any = {}): Observable<any> {

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    if (queryString) queryString = '?' + queryString;
    
    return this.http.get(`${environment.url}/racks${queryString}`)
      .catch(this.handleError);
  }

  createRack(newRack: any): Observable<any> {
    return this.http.post(`${environment.url}/racks`, newRack)
      .catch(this.handleError);
  }

  editRack(rackId: any, newRack: any): Observable<any> {
    return this.http.patch(`${environment.url}/racks/${rackId}`, newRack)
      .catch(this.handleError);
  }

  deleteRack(rackId: any): Observable<any> {
    return this.http.delete(`${environment.url}/racks/${rackId}`)
      .catch(this.handleError);
  }

  racksOnControlPoint(controlPointId: any): Observable<any> {
    return this.http.get(`${environment.url}/racks/on_control_point/${controlPointId}`)
      .catch(this.handleError);
  }

  createRackArray(array: any): Observable<any> { 
    return this.http.post(`${environment.url}/racks/create_many`, array)
      .catch(this.handleError);
  }

  getGeolocation(company_id: string, family_id: string = null, rack_serial: string = null): Observable<any> {

    let param: any = {};

    if (company_id) param.company_id = company_id;
    if (family_id) param.family_id = family_id;
    if (rack_serial) param.rack_serial = rack_serial;

    let queryString = Object.keys(param).map(key => key + '=' + param[key]).join('&');
    if (queryString) queryString = '?' + queryString;

    return this.http.get(`${environment.url}/racks/data/geolocation${queryString}`).catch(this.handleError);
  }


  /**
   * 
   * @param limit Rotas antigas
   * @param page 
   * @param attr 
   */
  getRacksPagination(limit: number, page: number, attr: any): Observable<any> {
    return this.http.get(`${environment.url}/rack/list/pagination/${limit}/${page}?attr=${attr}`)
      .catch(this.handleError);
  }

  getInventoryPagination(limit: number, page: number): Observable<any> {
    return this.http.get(`${environment.url}/rack/list/inventory/pagination/${limit}/${page}`)
      .catch(this.handleError);
  }

  getBySupplier(id: string): Observable<any> {
    return this.http.get(`${environment.url}/rack/list/supplier/${id}`)
      .catch(this.handleError);
  }

  getPositions(code: string): Observable<any> {
    return this.http.get(`${environment.url}/rack/position/${code}`)
      .catch(this.handleError);
  }

  getRacksByCode(id): Observable<any> {
    return this.http.get(`${environment.url}/rack/list/code/${id}`)
      .catch(this.handleError);
  }
 
  getRacksEquals(supplier: string, project: string, code: string): Observable<any> {
    return this.http.get(`${environment.url}/rack/list/equals/${supplier}/${project}/${code}`)
      .catch(this.handleError);
  }

  getRacksDistincts(): Observable<any> {
    return this.http.get(`${environment.url}/rack/list/distinct`)
      .catch(this.handleError);
  }

  getRacksDistinctsByLogistic(array: any): Observable<any> {
    return this.http.post(`${environment.url}/rack/list/distinct/logistic`, array)
      .catch(this.handleError);
  }

  getRacksDistinctsBySupplier(supplier: string): Observable<any> {
    return this.http.get(`${environment.url}/rack/list/distinct/suplier/${supplier}`)
      .catch(this.handleError);
  }

  getRacksByDepartment(id: string,limit: number, page: number): Observable<any> {
    return this.http.get(`${environment.url}/rack/list/department/${id}/${limit}/${page}`)
      .catch(this.handleError);
  }

  getRacksByRackCode(code: string, limit: number, page: number){
    return this.http.get(`${environment.url}/rack/list/distinct/${code}/${limit}/${page}`)
      .catch(this.handleError);
  }

  retrieveByPlants(limit: number, page: number, id: string): Observable<any> {
    return this.http.get(`${environment.url}/rack/list/pagination/${limit}/${page}/plant/${id}`)
      .catch(this.handleError);
  }

  retrieveAllNoBinded(supplier: any): Observable<any> {

    return this.http.get(`${environment.url}/rack/list/all/nobinded/${supplier}`)
      .catch(this.handleError);
  }

  retrieveRack(id: string): Observable<any>{
    return this.http.get(`${environment.url}/rack/retrieve/${id}`)
      .catch(this.handleError);
  }

  retrieveRackByCodeAndSerial(code: string,serial: string): Observable<any>{
    return this.http.get(`${environment.url}/rack/retrieve/code/${code}/serial/${serial}`)
      .catch(this.handleError);
  }

  retrieveRackBySupplierAndCodeAndProject(code: string,supplier: string, project: string): Observable<any>{
    return this.http.get(`${environment.url}/rack/retrieve/code/${code}/supplier/${supplier}/project/${project}`)
      .catch(this.handleError);
  }


  retrieveInventory(limit: number, page: number): Observable<any>{
    return this.http.get(`${environment.url}/rack/list/inventory/pagination/${limit}/${page}`)
      .catch(this.handleError);
  }

  // updateRack(id: string, rack: any): Observable<any>{
  //   return this.http.put(`${environment.url}/rack/update/${id}`,rack)
  //     .catch(this.handleError);
  // }

  updateRackByGC16(code: string,supplier: string,project: string, rack: any): Observable<any>{
    return this.http.put(`${environment.url}/rack/update/gc16/${code}/${supplier}/${project}`,rack)
      .catch(this.handleError);
  }

  updateRackUnset(id: string): Observable<any>{
    return this.http.put(`${environment.url}/rack/update/unset/${id}`,{})
      .catch(this.handleError);
  }

  updateAllRack(code: string, supplier: string, rack: any): Observable<any>{
    return this.http.put(`${environment.url}/rack/update/all/${code}/${supplier}`,rack)
      .catch(this.handleError);
  }

  // deleteRack(id: string): Observable<any>{
  //   return this.http.delete(`${environment.url}/rack/delete/${id}`)
  //     .catch(this.handleError);
  // }

  // createRack(tag: Rack []): Observable<any>{
  //   return this.http.post(`${environment.url}/rack/create`, tag)
  //     .catch(this.handleError);
  // }

  

  loadingRackPerPlant(limit: number, page: number): Observable<any>{
    return this.http.get(`${environment.url}/rack/list/quantiy/per/plant/${limit}/${page}`)
      .catch(this.handleError);
  }

  loadingRackPerCondition(): Observable<any>{
    return this.http.get(`${environment.url}/rack/quantity/per/condition`)
      .catch(this.handleError);
  }

  //
  /**
   * This method retrieves the rack positions that matches the 'initial date', 'final date' and 'max accuracy error'.
   * If final date isn't given, then consider finalDate = today, because there is no position generated from tomorrow. :)
   * 
   * @param code The package code
   * @param initialDate The first date to generate position in the map
   * @param finalDate The last  date to generate position in the map
   * @param accuracy The max accuracy error
   * 
   */
  getFilteredPositions(code: string, initialDate: number, finalDate: number): Observable<any> {
    return this.http.get(`${environment.url}/rack/position/${code}?initial_date=${initialDate}&final_date=${finalDate}`)
      .catch(this.handleError);
  }

}

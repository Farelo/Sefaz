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

  getPackingsPagination(limit: number, page: number, attr: any): Observable<any> {
    return this.http.get(`${environment.url}packing/list/pagination/${limit}/${page}?attr=${attr}`)
      .catch(this.handleError);
  }

  getInventoryPagination(limit: number, page: number): Observable<any> {
    return this.http.get(`${environment.url}packing/list/inventory/pagination/${limit}/${page}`)
      .catch(this.handleError);
  }

  getBySupplier(id: string): Observable<any> {
    return this.http.get(`${environment.url}packing/list/supplier/${id}`)
      .catch(this.handleError);
  }

  getPositions(code: string): Observable<any> {
    return this.http.get(`${environment.url}packing/position/${code}`)
      .catch(this.handleError);
  }

  getPackingsByCode(id): Observable<any> {
    return this.http.get(`${environment.url}packing/list/code/${id}`)
      .catch(this.handleError);
  }

  getPackingsByDepartment(id: string,limit: number, page: number): Observable<any> {
    return this.http.get(`${environment.url}packing/list/department/${id}/${limit}/${page}`)
      .catch(this.handleError);
  }

  retrieveByPlants(limit: number, page: number, id: string): Observable<any> {
    return this.http.get(`${environment.url}packing/list/pagination/${limit}/${page}/plant/${id}`)
      .catch(this.handleError);
  }

  retrieveAllNoBinded(supplier: any): Observable<any> {

    return this.http.get(`${environment.url}packing/list/all/nobinded/${supplier}`)
      .catch(this.handleError);
  }

  retrievePacking(id: string): Observable<any>{
    return this.http.get(`${environment.url}packing/retrieve/${id}`)
      .catch(this.handleError);
  }

  retrievePackingByCodeAndSerial(code: string,serial: string): Observable<any>{
    return this.http.get(`${environment.url}packing/retrieve/code/${code}/serial/${serial}`)
      .catch(this.handleError);
  }

  retrievePackingBySupplierAndCodeAndProject(code: string,supplier: string, project: string): Observable<any>{
    return this.http.get(`${environment.url}packing/retrieve/code/${code}/supplier/${supplier}/project/${project}`)
      .catch(this.handleError);
  }


  retrieveInventory(limit: number, page: number): Observable<any>{
    return this.http.get(`${environment.url}packing/list/inventory/pagination/${limit}/${page}`)
      .catch(this.handleError);
  }

  updatePacking(id: string, packing: any): Observable<any>{
    return this.http.put(`${environment.url}packing/update/${id}`,packing)
      .catch(this.handleError);
  }

  updatePackingByGC16(code: string,supplier: string,project: string, packing: any): Observable<any>{
    return this.http.put(`${environment.url}packing/update/gc16/${code}/${supplier}/${project}`,packing)
      .catch(this.handleError);
  }

  updatePackingUnset(id: string): Observable<any>{
    return this.http.put(`${environment.url}packing/update/unset/${id}`,{})
      .catch(this.handleError);
  }

  updateAllPacking(code: string, supplier: string, packing: any): Observable<any>{
    return this.http.put(`${environment.url}packing/update/all/${code}/${supplier}`,packing)
      .catch(this.handleError);
  }

  deletePacking(id: string): Observable<any>{
    return this.http.delete(`${environment.url}packing/delete/${id}`)
      .catch(this.handleError);
  }

  createPacking(tag: Packing []): Observable<any>{
    return this.http.post(`${environment.url}packing/create`, tag)
      .catch(this.handleError);
  }

  createPackingArray(array: any): Observable<any>{
    return this.http.post(`${environment.url}packing/create/array`, array)
      .catch(this.handleError);
  }

}

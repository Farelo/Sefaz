import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Supplier } from '../shared/models/supplier';
import { environment } from '../../environments/environment';

@Injectable()
export class SuppliersService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getSuppliersPagination(limit: number, page: number): Observable<any> {
    return this.http.get(`${environment.url}supplier/list/pagination/${limit}/${page}`)
      .catch(this.handleError);
  }

  retrieveAll(): Observable<any> {
    return this.http.get(`${environment.url}supplier/list/all`)
      .catch(this.handleError);
  }

  retrieveSupplier(id: string): Observable<any>{
    return this.http.get(`${environment.url}supplier/retrieve/${id}`)
      .catch(this.handleError);
  }

  retrieveSupplierByDunsAndSupplier(duns: string,name: string): Observable<any>{
    return this.http.get(`${environment.url}supplier/retrieve/duns/${duns}/name/${name}`)
      .catch(this.handleError);
  }

  updateSupplier(id: string, supplier: any): Observable<any>{
    return this.http.put(`${environment.url}supplier/update/${id}`,supplier)
      .catch(this.handleError);
  }

  updateSupplierUnset(id: string): Observable<any>{
    return this.http.put(`${environment.url}supplier/update/unset/${id}`,{})
      .catch(this.handleError);
  }

  deleteSupplier(id: string): Observable<any>{
    return this.http.delete(`${environment.url}supplier/delete/${id}`)
      .catch(this.handleError);
  }

  createSupplier(supplier: Supplier): Observable<any>{
    return this.http.post(`${environment.url}supplier/create`, supplier)
      .catch(this.handleError);
  }

}

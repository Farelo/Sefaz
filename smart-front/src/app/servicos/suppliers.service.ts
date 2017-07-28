import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Supplier } from '../shared/models/supplier';
import { environment } from '../../environments/environment';

@Injectable()
export class SuppliersService {

  constructor(private http: Http) { }

  getSuppliersPagination(limit: number, page: number): Observable<any> {
    return this.http.get(environment.url + 'supplier/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<any> {
    return this.http.get(environment.url + 'supplier/list/all')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveSupplier(id: string): Observable<any>{
    return this.http.get(environment.url + 'supplier/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateSupplier(id: string, supplier: any): Observable<any>{
    return this.http.put(environment.url + 'supplier/update/' + id,supplier)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateSupplierUnset(id: string): Observable<any>{
    return this.http.put(environment.url + 'supplier/update/unset/' + id,{})
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteSupplier(id: string): Observable<any>{
    return this.http.delete(environment.url + 'supplier/delete/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createSupplier(supplier: Supplier): Observable<any>{
    return this.http.post(environment.url + 'supplier/create', supplier)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

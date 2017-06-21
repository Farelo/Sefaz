import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Supplier } from '../shared/models/supplier';

@Injectable()
export class SuppliersService {

  constructor(private http: Http) { }
  private url = 'http://localhost:8984/api/';
 //private url = 'http://isi.pe.senai.br:8984/api/';
  getSuppliersPagination(limit: number, page: number): Observable<Supplier[]> {
    return this.http.get(this.url + 'supplier/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().suppliers)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<Supplier[]> {
    return this.http.get(this.url + 'supplier/list/all')
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveSupplier(id: string): Observable<Supplier>{
    return this.http.get(this.url + 'supplier/retrieve/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateSupplier(id: string, supplier: Supplier): Observable<Supplier>{
    return this.http.put(this.url + 'supplier/update/' + id,supplier)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteSupplier(id: string): Observable<Supplier>{
    return this.http.delete(this.url + 'supplier/delete/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createSupplier(supplier: Supplier): Observable<Supplier>{
    return this.http.post(this.url + 'supplier/create', supplier)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

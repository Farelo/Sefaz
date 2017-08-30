import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Packing } from '../shared/models/packing';
import { environment } from '../../environments/environment';

@Injectable()
export class PackingService {

  constructor(private http: Http) { }

  getPackingsPagination(limit: number, page: number): Observable<any> {
    return this.http.get(environment.url + 'packing/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getPackingsPaginationByAttr(limit: number, page: number, attr: string): Observable<any> {
    return this.http.get(environment.url + 'packing/list/pagination/attribute/' + limit + '/' + page + '/' + attr)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryPagination(limit: number, page: number): Observable<any> {
    return this.http.get(environment.url + 'packing/list/inventory/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getBySupplier(id: string): Observable<any> {
    return this.http.get(environment.url + 'packing/list/supplier/' + id  )
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getPackingsByCode(id): Observable<any> {
    return this.http.get(environment.url + 'packing/list/code/'+ id )
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getPackingsByDepartment(id): Observable<any> {
    return this.http.get(environment.url + 'packing/list/department/'+ id )
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAllNoBinded(supplier: any): Observable<any> {

    return this.http.get(environment.url + 'packing/list/all/nobinded/'+ supplier)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrievePacking(id: string): Observable<any>{
    return this.http.get(environment.url + 'packing/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrievePackingBySupplierAndCode(code: string,supplier: string): Observable<any>{
    return this.http.get(environment.url + 'packing/retrieve/code/'+code+'/supplier/' + supplier)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


  retrieveInventory(limit: number, page: number): Observable<any>{
    return this.http.get(environment.url + 'packing/list/inventory/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updatePacking(id: string, packing: any): Observable<any>{
    return this.http.put(environment.url + 'packing/update/' + id,packing)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        console.log(error);
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  updatePackingByCode(code: string, packing: any): Observable<any>{
    return this.http.put(environment.url + 'packing/update/code/' + code,packing)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updatePackingUnset(id: string): Observable<any>{
    return this.http.put(environment.url + 'packing/update/unset/' + id,{})
      .map((res: Response) => res.json())
      .catch((error: any) =>  Observable.throw(error.json().error || 'Server error'));
  }

  updateAllPacking(code: string, supplier: string, packing: any): Observable<any>{
    return this.http.put(environment.url + 'packing/update/all/' + code + "/"+ supplier,packing)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deletePacking(id: string): Observable<any>{
    return this.http.delete(environment.url + 'packing/delete/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createPacking(tag: Packing []): Observable<any>{
    return this.http.post(environment.url + 'packing/create', tag)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

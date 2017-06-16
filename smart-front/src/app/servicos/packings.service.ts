import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Packing } from '../shared/models/packing';

@Injectable()
export class PackingService {

  constructor(private http: Http) { }
  private url = 'http://localhost:8080/api/';


  getPackingsPagination(limit: number, page: number): Observable<Packing[]> {
    return this.http.get(this.url + 'packing/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().packings)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryPagination(limit: number, page: number): Observable<Packing[]> {
    return this.http.get(this.url + 'packing/list/inventory/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().packings)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getPackingsByCode(id): Observable<Packing[]> {
    return this.http.get(this.url + 'packing/list/code/'+ id )
      .map((res: Response) => res.json().packings)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getPackingsByDepartment(id): Observable<Packing[]> {
    return this.http.get(this.url + 'packing/list/department/'+ id )
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAllNoBinded(): Observable<Packing[]> {

    return this.http.get(this.url + 'packing/list/all/nobinded')
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrievePacking(id: string): Observable<Packing>{
    return this.http.get(this.url + 'packing/retrieve/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


  retrieveInventory(limit: number, page: number): Observable<any>{
    return this.http.get(this.url + 'packing/list/inventory/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updatePacking(id: string, packing: Packing): Observable<Packing>{
    return this.http.put(this.url + 'packing/update' + id,packing)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateAllPacking(code: string, supplier: string, packing: Packing): Observable<Packing>{
    return this.http.put(this.url + 'packing/update/all/' + code + "/"+ supplier,packing)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deletePacking(id: string): Observable<Packing>{
    return this.http.delete(this.url + 'packing/delete/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createPacking(tag: Packing []): Observable<Packing>{
    return this.http.post(this.url + 'packing/create', tag)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

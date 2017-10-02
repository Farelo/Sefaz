import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class InventoryLogisticService {

  constructor(private http: Http) { }


  getInventoryGeneral(limit: number, page: number, array: any): Observable<any> {

    return this.http.post(environment.url + 'inventory/logistic/general/' + limit + '/' + page, array)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryGeneralPackings(limit: number, page: number, code: string, array: any): Observable<any> {
    return this.http.post(environment.url + 'inventory/logistic/general/packings/' + limit + '/' + page + '?code='+ code, array)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryPermanence(limit: number, page: number, code: string, array: any): Observable<any> {

    return this.http.post(environment.url + 'inventory/logistic/permanence/' + limit + '/' + page + '/'+ code, array)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryQuantity(limit: number, page: number, code: string, array: any): Observable<any> {

    return this.http.post(environment.url + 'inventory/logistic/quantity/' + limit + '/' + page + '/'+ code, array)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryPackingHistoric(limit: number, page: number, serial: string, code: string, array: any): Observable<any> {

    return this.http.post(environment.url + 'inventory/logistic/packing/historic/' + limit + '/' + page + '/'+ serial+ '/'+ code, array)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryBattery(limit: number, page: number, code: string, array: any): Observable<any> {

    return this.http.post(environment.url + 'inventory/logistic/battery/' + limit + '/' + page + '?code='+ code , array )
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


  getInventorySupplierByPlantAnd(limit: number, page: number, code: string, supplier: string, project: string): Observable<any> {

    return this.http.get(environment.url + 'inventory/plant/' + limit + '/' + page + '/'+ code + '/'+ supplier+ '/'+ project)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


}

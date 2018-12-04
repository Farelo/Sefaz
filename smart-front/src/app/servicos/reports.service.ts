import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class ReportsService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getGeneralInventory(family: any = '') {

    if (!family){ 
      return this.http.get(`${environment.url}/reports/general_info`).catch(this.handleError); 

    } else { 
      return this.http.get(`${environment.url}/reports/general_info?family=${family}`).catch(this.handleError);
    }
  }

  getGeneralEquipmentInventory() {

    return this.http.get(`${environment.url}/reports/general_inventory`).catch(this.handleError);
  }

  getPermanenceInventory(){

    return this.http.get(`${environment.url}/reports/permanence_time`).catch(this.handleError);
  }
}

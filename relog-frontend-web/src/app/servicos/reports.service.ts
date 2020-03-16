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

  /**
   * Equipamento/geral
   * @param family 
   */
  getGeneralInventory(family: any = '') {

    if (!family){ 
      return this.http.get(`${environment.url}/reports/general_info`).catch(this.handleError); 

    } else { 
      return this.http.get(`${environment.url}/reports/general_info?family=${family}`).catch(this.handleError);
    }
  }

  /**
   * Equipamento/Inventário geral
   */
  getGeneralEquipmentInventory() {

    return this.http.get(`${environment.url}/reports/general_inventory`).catch(this.handleError);
  }

  /**
   * Equipamento/Inventário geral
   */
  getPermanenceInventory(params: any = {}){
    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    if (queryString) queryString = '?' + queryString;
    
    return this.http.get(`${environment.url}/reports/permanence_time${queryString}`).catch(this.handleError);
  }

  /**
   * Equipamento/Tempo de permanência
   */
  getAbsentInventory(){

    return this.http.get(`${environment.url}/reports/absent`).catch(this.handleError);
  }

  /**
   * Fornecedor
   */
  getClientsInventory(companyId: any) {

    return this.http.get(`${environment.url}/reports/clients?company=${companyId}`).catch(this.handleError);
  }

  /**
   * Bateria
   */
  getBatteryInventory() {

    return this.http.get(`${environment.url}/reports/battery`).catch(this.handleError);
  }
  
  /**
   * Quantidade
   */
  getQuantityInventory() {

    return this.http.get(`${environment.url}/reports/quantity`).catch(this.handleError);
  }

  /**
   * Geral
   */
  getGeneral() { 

    return this.http.get(`${environment.url}/reports/general`).catch(this.handleError);
  }
}

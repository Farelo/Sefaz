import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Rack } from '../shared/models/rack';
import { environment } from '../../environments/environment';

@Injectable()
export class DevicesService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  /**
   * This method retrieves the rack positions that matches the 'initial date', 'final date' and 'max accuracy error'.
   * If final date isn't given, then consider finalDate = today, because there is no position generated from tomorrow. :)
   * 
   * @param device_tag The package code
   * @param initialDate The first date to generate position in the map
   * @param finalDate The last  date to generate position in the map
   * @param accuracy The max accuracy error
   * 
   */
  getFilteredPositions(device_tag: string, start_date: string = null, end_date: string = null, accuracy: number = null): Observable<any> {

    let param: any = {};

    if (start_date) param.start_date = start_date;
    if (end_date) param.end_date = end_date;
    if (accuracy) param.accuracy = accuracy;

    let queryString = Object.keys(param).map(key => key + '=' + param[key]).join('&');
    if (queryString) queryString = '?' + queryString;

    return this.http.get(`${environment.url}/device_data/data/${device_tag}${queryString}`).catch(this.handleError);
  }

  getDeviceData(company_id: string, family_id: string = null, rack_serial: string = null): Observable<any> {

    let param: any = {};

    if (company_id) param.company_id = company_id;
    if (family_id) param.family_id = family_id;
    if (rack_serial) param.rack_serial = rack_serial;

    let queryString = Object.keys(param).map(key => key + '=' + param[key]).join('&');
    if (queryString) queryString = '?' + queryString;

    return this.http.get(`${environment.url}/racks/data/geolocation${queryString}`).catch(this.handleError);
  }

}

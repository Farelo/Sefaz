import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Packing } from '../shared/models/packing';
import { environment } from '../../environments/environment';

@Injectable()
export class TemperaturesService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  /**
   * This method retrieves the packing positions that matches the 'initial date', 'final date' and 'max accuracy error'.
   * If final date isn't given, then consider finalDate = today, because there is no position generated from tomorrow. :)
   * 
   * @param device_tag The package code
   * @param initialDate The first date to generate position in the map
   * @param finalDate The last  date to generate position in the map
   * @param accuracy The max accuracy error
   * 
   */
  getFilteredTemperatures(device_tag: string, start_date: string = null, end_date: string = null): Observable<any> {

    let param: any = {};

    if (device_tag) param.tag = device_tag;
    if (start_date) param.start_date = start_date;
    if (end_date) param.end_date = end_date;

    let queryString = Object.keys(param).map(key => key + '=' + param[key]).join('&');
    if (queryString) queryString = '?' + queryString;

    return this.http.get(`${environment.url}/temperatures/${queryString}`).catch(this.handleError);
  }

}
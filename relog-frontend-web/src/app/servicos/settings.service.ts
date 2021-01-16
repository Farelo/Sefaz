import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { HttpClient, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable"; 
import { environment } from "../../environments/environment";
import axios from "../shared/util/axios";

@Injectable()
export class SettingsService {
  constructor(private http: HttpClient) {}

  private handleError(error: Response) {
    return Observable.throw(error);
  }

  async getSettings() {
    try { 
      return await axios.get(`${environment.url}/settings`);
    } catch (error) {
      this.handleError;
    }
  }

  editSetting(setting: any, id: string): Observable<any> {
    return this.http
      .patch(`${environment.url}/settings/${id}`, setting)
      .catch(this.handleError);
  }
}

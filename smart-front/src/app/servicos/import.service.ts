import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class ImportService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  sendDataToImportTag(file: any): Observable<any> {
    return this.http.post(`${environment.url}upload/tag`, file)
      .catch(this.handleError);
  }

  sendDataToImportProject(file: any): Observable<any> {
    return this.http.post(`${environment.url}upload/project`, file)
      .catch(this.handleError);
  }

  sendDataToImportPlant(file: any): Observable<any> {
    return this.http.post(`${environment.url}upload/plant`, file)
      .catch(this.handleError);
  }

  sendDataToImportDepartment(file: any): Observable<any> {
    return this.http.post(`${environment.url}upload/department`, file)
      .catch(this.handleError);
  }

  sendDataToImportPacking(file: any): Observable<any> {
    return this.http.post(`${environment.url}upload/packing`, file)
      .catch(this.handleError);
  }

  sendDataToImportRoute(file: any): Observable<any> {
    return this.http.post(`${environment.url}upload/route`, file)
      .catch(this.handleError);
  }

}

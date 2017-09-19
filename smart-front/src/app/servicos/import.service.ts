import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class ImportService {

  constructor(private http: Http) { }

  sendDataToImportTag(file: any): Observable<any> {
    return this.http.post(environment.url + 'upload/tag', file)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  sendDataToImportProject(file: any): Observable<any> {
    return this.http.post(environment.url + 'upload/project', file)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  sendDataToImportPlant(file: any): Observable<any> {
    return this.http.post(environment.url + 'upload/plant', file)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  sendDataToImportDepartment(file: any): Observable<any> {
    return this.http.post(environment.url + 'upload/department', file)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  sendDataToImportPacking(file: any): Observable<any> {
    return this.http.post(environment.url + 'upload/packing', file)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  sendDataToImportRoute(file: any): Observable<any> {
    return this.http.post(environment.url + 'upload/route', file)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

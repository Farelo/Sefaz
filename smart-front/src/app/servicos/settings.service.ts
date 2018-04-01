import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Route } from '../shared/models/route';
import { environment } from '../../environments/environment';

@Injectable()
export class SettingsService {

    constructor(private http: HttpClient) { }

    private handleError(error: Response) {
        return Observable.throw(error);
    }

    retrieve(): Observable<any> {
        return this.http.get(`${environment.url}settings/retrieve`)
            .catch(this.handleError);
    }
    
    update(setting: any): Observable<any> {
        return this.http.put(`${environment.url}settings/update`, setting)
            .catch(this.handleError);
    }


}

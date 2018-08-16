import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class HomeService {

    constructor(private http: HttpClient) { }

    private handleError(error: Response) {
        return Observable.throw(error);
    }

    getResumeHome(): Observable<any> {
        return this.http.get(`${environment.url}home/packings/stats`)
            .catch(this.handleError);
    }
}

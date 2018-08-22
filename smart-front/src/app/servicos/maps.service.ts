import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class MapsService {

    constructor(private http: HttpClient) { }

    private handleError(error: Response) {
        return Observable.throw(error);
    }

    getPackings(params: any = []): Observable<any> {
        var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
        if (queryString) { queryString = '?' + queryString; }

        console.log('queryString: ' + queryString);

        return this.http.get(`${environment.url}maps/packings${queryString}`)
            .catch(this.handleError);
    }
}

import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,HttpErrorResponse} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
  ){ }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(JSON.parse(localStorage.getItem('currentUser'))){
      req = req.clone({headers: req.headers.set('Authorization', JSON.parse(localStorage.getItem('currentUser')).token)});
    }

    return next
      .handle(req)
      .do((ev: HttpEvent<any>) => {


      })
      .catch(response => {
        if (response instanceof HttpErrorResponse) {
        }
        return Observable.throw(response);
      });

  }
}

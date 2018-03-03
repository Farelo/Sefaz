import {Injectable} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable} from "rxjs";
import { AuthenticationService } from '../servicos/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ){ }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(JSON.parse(localStorage.getItem('currentUser'))){
      req = req.clone({headers: req.headers.set('Authorization', JSON.parse(localStorage.getItem('currentUser')).token)});
    }

    return next
      .handle(req)
      .do((ev: HttpEvent<any>) => {
         
        if (ev instanceof HttpResponse){
          
          if (ev["body"].refresh_token){
            var user = this.authenticationService.currentUser();
            user.token = ev["body"].refresh_token;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
         }
        return ev;
      })
      .catch(error => {
        if (error instanceof HttpErrorResponse) {
          
          if (error.status === 401) { // erro na autenticação
            this.authenticationService.logout();
            this.router.navigate(['/login']);
          }

          if (error.status === 0){ // o servidor não responde
            this.authenticationService.logout();
            this.router.navigate(['/login']);
          }
        }
        
        return Observable.throw(error);
      });

  }
}

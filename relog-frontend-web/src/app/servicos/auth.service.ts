import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';
import { SettingsService } from './settings.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AuthenticationService {

  constructor(
    public translate: TranslateService,
    private http: HttpClient,
    private settingsService: SettingsService) { }

  login(password: string, username: string): Observable<any> {
    //return this.http.get(`${environment.url}profile/auth/${password}/${username}`)
    return this.http
      .post(`${environment.url}/users/sign_in`, {
        email: username,
        password: password
      })
      .map(response => this.auth(response))
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throw(error);
  }

  auth(response) {
    // login successful if there's a jwt token in the response
    let user = response;

    if (user) {
      user.token = response.token;

      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem("currentUser", JSON.stringify(user));

      //save user seetings
      this.settingsService.getSettings().subscribe(result => {
        localStorage.setItem("currentSettings", JSON.stringify(result));
        this.updateLanguage(result.language);
      });
    }
    return user;
  }

  updateLanguage(lang = 'pt') {
    console.log(lang);
    //resolve the language
    //i18n
    //this.translate.addLangs(['en', 'es', 'pt']);

    //Use the saved user language if exists, or 'en' if doesn't
    //const browserLang = this.translate.getBrowserLang();
    console.log(this.translate.getLangs());

    let result = this.translate.getLangs().find(elem => elem == lang);
    console.log(result);

    this.translate.use(lang.match(/en|es|pt/) ? lang : 'en');
  }

  currentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
  }


  currentSettings() {
    return JSON.parse(localStorage.getItem("currentSettings"));
  }

  updateCurrentUser() {
    var user = JSON.parse(localStorage.getItem("currentUser"));
    this.login(user.password, user.email);
  }

  updateCurrentSettings(actualSettings) {
    //save user seetings
    // this.settingsService.getSettings().subscribe(result => {
      localStorage.setItem("currentSettings", JSON.stringify(actualSettings));
      this.updateLanguage(actualSettings.language);
    // });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
  }
}

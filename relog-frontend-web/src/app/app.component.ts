import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './servicos/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],


})
export class AppComponent {
  title = 'app works!';

  constructor(public translate: TranslateService, private authenticationService: AuthenticationService) {
    console.log('this.translate.currentLang: ', this.translate.currentLang)

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) {

      translate.addLangs(['en', 'es', 'pt']);

      let settings = this.authenticationService.currentSettings();
      const browserLang = translate.getBrowserLang();

      if (settings && settings.language !== undefined)
        translate.use(settings.language.match(/en|es|pt/) ? settings.language : browserLang);
      else
        translate.use(browserLang);
    }
  }

}

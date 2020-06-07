import { NgModule } from '@angular/core';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '../../../assets/i18n/', '.json');
}

@NgModule({
  declarations: [],
  imports: [
    TranslateSettingsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: false
    }),
  ],
  exports: [TranslateModule]
})

export class TranslateSettingsModule {
  constructor(private translate: TranslateService) {

    translate.addLangs(['en', 'es', 'pt']);
    //translate.setDefaultLang('pt');

    const browserLang = translate.getBrowserLang();
    console.log(browserLang);
    //translate.use('es');

    //Use the browser language if exists, or pt if doesn't
    translate.use(browserLang.match(/en|es|pt/) ? browserLang : 'en');
  }
}
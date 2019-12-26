import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CadastrosComponent } from './cadastros.component';
import { CadastrosRoutingModule } from './cadastros.routing.module';
import { ToastyModule } from 'ng2-toasty'
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApplicationPipes } from '../../shared/pipes/application.pipes';
import { TextMaskModule } from 'angular2-text-mask';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  imports: [
    CommonModule,
    CadastrosRoutingModule,
    ToastyModule.forRoot(),
    AlertModule.forRoot(),
    FormsModule,
    TextMaskModule,
    NgSelectModule,
    ApplicationPipes,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    CadastrosComponent
  ]
})
export class CadastrosModule { }

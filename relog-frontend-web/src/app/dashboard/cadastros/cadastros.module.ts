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
import { TranslateSettingsModule } from 'app/shared/translate/translateSettings.module';

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
    TranslateSettingsModule
  ],
  declarations: [
    CadastrosComponent
  ]
})
export class CadastrosModule { }

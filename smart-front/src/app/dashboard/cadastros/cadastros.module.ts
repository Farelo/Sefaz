import { NgModule } from '@angular/core';
import { CadastrosComponent } from './cadastros.component';
import { CadastrosRoutingModule } from './cadastros.routing.module';
import { ToastyModule } from 'ng2-toasty'
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApplicationPipes } from '../../shared/pipes/application.pipes';
import { TextMaskModule } from 'angular2-text-mask';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CadastrosRoutingModule,
    ToastyModule.forRoot(),
    AlertModule.forRoot(),
    FormsModule,
    TextMaskModule,
    NgSelectModule,
    ApplicationPipes
  ],
  declarations: [
    CadastrosComponent,
  ]
})
export class CadastrosModule { }

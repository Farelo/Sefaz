import { NgModule } from '@angular/core';
import { CadastrosComponent } from './cadastros.component';
import { CadastrosRoutingModule } from './cadastros.routing.module';
import {ToastyModule} from 'ng2-toasty'
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CadastrosRoutingModule,
    ToastyModule.forRoot(),
    AlertModule.forRoot(),
    NgSelectModule
  ],
  declarations: [
    CadastrosComponent
  ]
})
export class CadastrosModule { }

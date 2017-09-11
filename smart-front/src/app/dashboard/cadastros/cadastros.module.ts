import { NgModule } from '@angular/core';
import { CadastrosComponent } from './cadastros.component';
import { CadastrosRoutingModule } from './cadastros.routing.module';
import {ToastyModule} from 'ng2-toasty'


@NgModule({
  imports: [
    CadastrosRoutingModule,
    ToastyModule.forRoot()
  ],
  declarations: [
    CadastrosComponent
  ]
})
export class CadastrosModule { }

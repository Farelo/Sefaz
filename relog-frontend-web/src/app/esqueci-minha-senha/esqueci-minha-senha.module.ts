/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {EsqueciMinhaSenhaComponent} from './esqueci-minha-senha.component';
import {EsqueciMinhaSenhaRoutingModule} from './esqueci-minha-senha.routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ReactiveFormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    EsqueciMinhaSenhaRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AlertModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    EsqueciMinhaSenhaComponent
  ],
  providers: [
  ],
})
export class EsqueciMinhaSenhaModule { }

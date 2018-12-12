/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {RedefinirSenhaComponent} from './redefinir-senha.component';
import {RedefinirSenhaRoutingModule} from './redefinir-senha.routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [
    RedefinirSenhaRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AlertModule,
    ReactiveFormsModule
  ],
  declarations: [
    RedefinirSenhaComponent
  ],
  providers: [
  ],
})
export class RedefinirSenhaModule { }

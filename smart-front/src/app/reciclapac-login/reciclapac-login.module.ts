/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ReciclapacLoginComponent} from './reciclapac-login.component';
import {ReciclapacLoginRoutingModule} from './reciclapac-login.routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [
    ReciclapacLoginRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AlertModule,
    ReactiveFormsModule
  ],
  declarations: [
    ReciclapacLoginComponent
  ],
  providers: [
  ],
})
export class ReciclapacLoginModule { }

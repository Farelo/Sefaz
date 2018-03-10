/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {UserAdicionarComponent} from './user-adicionar/user-adicionar.component';
import {UserEditarComponent} from './user-editar/user-editar.component';
import {UserComponent} from './user.component';
import {UserRoutingModule} from './user.routing.module';
import { CommonModule } from '@angular/common'
import { NgxPaginationModule} from 'ngx-pagination';
import { ApplicationPipes } from '../../shared/pipes/application.pipes';
import { ModalModule ,TooltipModule} from 'ngx-bootstrap'
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng2-select2';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    UserRoutingModule,
    CommonModule,
    RouterModule,
    Select2Module,
    NgxPaginationModule,
    ApplicationPipes,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    FormsModule,
    ReactiveFormsModule

  ],
  declarations: [
    UserComponent,
    UserEditarComponent,
    UserAdicionarComponent

  ],
  providers: [
    NgbActiveModal
  ],
})
export class UserModule { }

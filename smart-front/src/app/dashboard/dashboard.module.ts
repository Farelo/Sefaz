import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { CadastrosModule } from './cadastros/cadastros.module';
import { ModalModule ,TooltipModule} from 'ngx-bootstrap'
import { DashboardRoutingModule } from './dashboard.routing.module';
import { NgbModule, NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng2-select2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule} from '@angular/forms';
import {ToastyModule} from 'ng2-toasty';
import { ApplicationPipes } from '../shared/pipes/application.pipes';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CadastrosModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    TooltipModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ApplicationPipes,
    DashboardRoutingModule,
    NgxPaginationModule,
    Select2Module

  ],
  declarations: [
    DashboardComponent,
    NavbarComponent,
  ],
  providers: [
    NgbActiveModal
  ],
})
export class DashboardModule { }

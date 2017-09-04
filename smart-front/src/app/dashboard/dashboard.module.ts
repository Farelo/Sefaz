import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HotTableModule } from 'ng2-handsontable';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { InventarioComponent } from './inventario/inventario.component';
import { ImportarComponent } from './importar/importar.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { HomeModule } from './home/home.module';
import { CadastrosModule } from './cadastros/cadastros.module';
import { RastreamentoModule } from './rastreamento/rastreamento.module';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { ModalModule } from 'ngx-bootstrap/modal'
import { DashboardRoutingModule } from './dashboard.routing.module';
import { NgbModule, NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Gc16Component } from './gc16/gc16.component';
import { Gc16AdicionarComponent } from './gc16/gc16-adicionar/gc16-adicionar.component';
import { Gc16EditarComponent } from './gc16/gc16-editar/gc16-editar.component';
import { Select2Module } from 'ng2-select2';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule} from '@angular/forms';
import {ToastyModule} from 'ng2-toasty';
import { ApplicationPipes } from '../shared/pipes/application.pipes';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HomeModule,
    CadastrosModule,
    RastreamentoModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ApplicationPipes,
    DashboardRoutingModule,
    HotTableModule,
    NgxPaginationModule,
    Select2Module

  ],
  declarations: [
    DashboardComponent,
    NavbarComponent,
    InventarioComponent,
    ImportarComponent,
    Gc16Component,
    Gc16AdicionarComponent,
    Gc16EditarComponent,
    FileSelectDirective,


  ],
  providers: [
    NgbActiveModal
  ],
})
export class DashboardModule { }

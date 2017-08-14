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
// import {SelectModule} from 'ng2-select';
// import { MultiSelectComponent } from "ng2-group-multiselect/src/";
import { SelectComponent } from '../shared/component/select';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HomeModule,
    CadastrosModule,
    RastreamentoModule,
    // SelectModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    // NgbModalOptions.forRoot(),
    DashboardRoutingModule,
    HotTableModule,
    NgxPaginationModule
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
    // MultiSelectComponent,
    SelectComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class DashboardModule { }

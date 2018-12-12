/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {Gc16AdicionarComponent} from './gc16-adicionar/gc16-adicionar.component';
import {Gc16EditarComponent} from './gc16-editar/gc16-editar.component';
import {Gc16Component} from './gc16.component';
import {GC16RoutingModule} from './gc16.routing.module';
import { CommonModule } from '@angular/common'
import { NgxPaginationModule} from 'ngx-pagination';
import { ApplicationPipes } from '../../shared/pipes/application.pipes';
import { ModalModule ,TooltipModule} from 'ngx-bootstrap'
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  imports: [
    GC16RoutingModule,
    NgSelectModule,
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    ApplicationPipes,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    FormsModule,
    ReactiveFormsModule

  ],
  declarations: [
    Gc16Component,
    Gc16EditarComponent,
    Gc16AdicionarComponent


  ],
  providers: [
    NgbActiveModal
  ],
})
export class GC16Module { }

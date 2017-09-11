/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {InventarioComponent} from './inventario.component';
import {InventarioRoutingModule} from './inventario.routing.module';
import { Select2Module } from 'ng2-select2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule} from 'ngx-pagination';
import { ApplicationPipes } from '../../shared/pipes/application.pipes';

@NgModule({
  imports: [
    InventarioRoutingModule,
    Select2Module,
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    ApplicationPipes

  ],
  declarations: [
    InventarioComponent
  ],
  providers: [
  ],
})
export class InventarioModule { }

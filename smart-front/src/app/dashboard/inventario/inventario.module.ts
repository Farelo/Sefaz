/**
 * Created by david on 7/09/17.
 */
import {NgModule}   from '@angular/core';
import {RouterModule} from '@angular/router';
import {InventarioComponent} from './inventario.component';
import {InventarioRoutingModule} from './inventario.routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule} from 'ngx-pagination';
import { ApplicationPipes } from '../../shared/pipes/application.pipes';
//import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap'

@NgModule({
  imports: [
    NgSelectModule,
    InventarioRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    ApplicationPipes,
    NgbModule,
    TooltipModule,
    //Angular2Csv
  ],
  declarations: [
    InventarioComponent
  ],
  providers: [
  ],
})
export class InventarioModule { }

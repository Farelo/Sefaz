/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ImportarComponent} from './importar.component';
import {ImportarRoutingModule} from './importar.routing.module';
import { CommonModule } from '@angular/common';
import { HotTableModule } from 'ng2-handsontable';


@NgModule({
  imports: [
    ImportarRoutingModule,
    CommonModule,
    RouterModule,
    HotTableModule
  ],
  declarations: [
    ImportarComponent
  ],
  providers: [
  ],
})
export class ImportarModule { }

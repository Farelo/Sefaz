/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home.routing.module';
import { CommonModule } from '@angular/common'
import { NgxPaginationModule} from 'ngx-pagination';
import { ApplicationPipes } from '../../shared/pipes/application.pipes';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    HomeRoutingModule,
    CommonModule,
    NgxPaginationModule,
    NgxChartsModule
  ],
  declarations: [
    HomeComponent
  ],
})
export class HomeModule { }


import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguiMapModule } from '@ngui/map';
import { RastreamentoComponent } from './rastreamento.component';
import { RastreamentoRoutingModule } from './rastreamento.routing.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { constants } from './../../../environments/constants';
import { ApplicationPipes } from '../../shared/pipes/application.pipes';
import { ModalModule, TooltipModule, PopoverModule } from 'ngx-bootstrap'
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    ApplicationPipes,
    CommonModule,
    FormsModule,
    NgSelectModule,
    RastreamentoRoutingModule,
    NgxPaginationModule,
    PopoverModule.forRoot(),
    NgbModule.forRoot(),
    NguiMapModule.forRoot({
      apiUrl: `https://maps.google.com/maps/api/js?key=${constants.GOOGLE_API_KEY}` +
      '&libraries=visualization,places,drawing',
    })
  ],
  declarations: [
    RastreamentoComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class RastreamentoModule { }

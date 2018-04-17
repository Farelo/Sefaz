
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguiMapModule } from '@ngui/map';
import { RastreamentoComponent } from './rastreamento.component';
import { RastreamentoRoutingModule } from './rastreamento.routing.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { constants } from './../../../environments/constants';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    RastreamentoRoutingModule,
    NgxPaginationModule,
    NguiMapModule.forRoot({
      apiUrl: `https://maps.google.com/maps/api/js?key=${constants.GOOGLE_API_KEY}` +
      '&libraries=visualization,places,drawing',
    })
  ],
  declarations: [
    RastreamentoComponent
  ]
})
export class RastreamentoModule { }

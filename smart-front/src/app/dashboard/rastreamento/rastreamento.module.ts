import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguiMapModule } from '@ngui/map';
import { RastreamentoComponent } from './rastreamento.component';
import { RastreamentoRoutingModule } from './rastreamento.routing.module';



@NgModule({
  imports: [
    CommonModule,
    RastreamentoRoutingModule,
    NguiMapModule.forRoot({
      apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCbMGRUwcqKjlYX4h4-P6t-xcDryRYLmCM' +
      '&libraries=visualization,places,drawing',
    })
  ],
  declarations: [
    RastreamentoComponent
  ]
})
export class RastreamentoModule { }

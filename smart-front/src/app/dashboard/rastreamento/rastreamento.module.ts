import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { RastreamentoComponent } from './rastreamento.component';


@NgModule({
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxExwipXRulS96HJrEmVO-CeI0HTek_CI'
    }),
    CommonModule
  ],
  declarations: [
    RastreamentoComponent
  ]
})
export class RastreamentoModule { }

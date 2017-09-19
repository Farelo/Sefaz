/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToastyModule} from 'ng2-toasty'
import { CommonModule } from '@angular/common'
import { NgxPaginationModule} from 'ngx-pagination';
import { ModalModule ,TooltipModule} from 'ngx-bootstrap'
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import {SetorCadastrarComponent} from './setor-cadastrar/setor-cadastrar.component';
import {SetorEditarComponent} from './setor-editar/setor-editar.component';
import {SetorComponent} from './setor.component';
import {SetorRoutingModule} from './setor.routing.module';
import { NguiMapModule } from '@ngui/map';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SetorRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NguiMapModule.forRoot({
      apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyDxZgf7T1S7LCVhXMPjDklRIcSqZfAE3WQ' +
      '&libraries=visualization,places,drawing',
    })

  ],
  declarations: [
    SetorCadastrarComponent,
    SetorEditarComponent,
    SetorComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class SetorModule { }

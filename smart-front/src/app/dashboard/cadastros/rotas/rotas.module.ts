
/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common'
import { NgxPaginationModule} from 'ngx-pagination';
import { ModalModule ,TooltipModule} from 'ngx-bootstrap'
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import {RotasCadastrarComponent} from './rotas-cadastrar/rotas-cadastrar.component';
import {RotasEditarComponent} from './rotas-editar/rotas-editar.component';
import {RotasComponent} from './rotas.component';
import {RotasRoutingModule} from './rotas.routing.module';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NguiMapModule } from '@ngui/map';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgSelectModule } from '@ng-select/ng-select';
import { constants } from './../../../../environments/constants';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AlertModule,
    NgSelectModule,
    RotasRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NguiMapModule.forRoot({
      apiUrl: `https://maps.google.com/maps/api/js?key=${constants.GOOGLE_API_KEY}` +
      '&libraries=visualization,places,drawing',
    })
  ],
  declarations: [
    RotasCadastrarComponent,
    RotasEditarComponent,
    RotasComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class RotasModule { }

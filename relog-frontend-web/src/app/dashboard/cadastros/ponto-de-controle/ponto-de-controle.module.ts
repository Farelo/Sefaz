import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ToastyModule } from 'ng2-toasty'
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule, TooltipModule } from 'ngx-bootstrap'
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PontoDeControleComponent } from './ponto-de-controle.component';
import { PontoDeControleCadastrarComponent } from './ponto-de-controle-cadastrar/ponto-de-controle-cadastrar.component';
import { PontoDeControleEditarComponent } from './ponto-de-controle-editar/ponto-de-controle-editar.component';
import { PlantaRoutingModule } from './ponto.routing.module';
import { NguiMapModule } from '@ngui/map';
import { constants } from '../../../../environments/constants'
import { ApplicationPipes } from 'app/shared/pipes/application.pipes';
import { TranslateSettingsModule } from 'app/shared/translate/translateSettings.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PlantaRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    ApplicationPipes,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NguiMapModule.forRoot({
      apiUrl: `https://maps.google.com/maps/api/js?key=${constants.GOOGLE_API_KEY}&libraries=drawing,visualization,places`
    }),
    TranslateSettingsModule
  ],
  declarations: [
    PontoDeControleComponent, 
    PontoDeControleCadastrarComponent, 
    PontoDeControleEditarComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class PontoDeControleModule { }

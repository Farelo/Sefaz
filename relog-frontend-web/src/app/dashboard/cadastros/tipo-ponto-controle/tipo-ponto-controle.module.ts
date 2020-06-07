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
import { ApplicationPipes } from 'app/shared/pipes/application.pipes';
import { TipoPontoControleRoutingModule } from './tipo-ponto-controle.routing.module';
import { TipoPontoControleCadastrarComponent } from './tipo-cadastrar/tipo-cadastrar.component';
import { TipoPontoControleEditarComponent } from './tipo-editar/tipo-editar.component';
import { TipoPontoControleComponent } from './tipo-ponto-controle.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TipoPontoControleRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    ApplicationPipes,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    TipoPontoControleCadastrarComponent,
    TipoPontoControleEditarComponent,
    TipoPontoControleComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class TipoPontoControleModule { }

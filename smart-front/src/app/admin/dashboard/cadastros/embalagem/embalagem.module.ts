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
import {EmbalagemCadastroComponent} from './embalagem-cadastro/embalagem-cadastro.component';
import {EmbalagemEditarComponent} from './embalagem-editar/embalagem-editar.component';
import {EmbalagemComponent} from './embalagem.component';
import {EmbalagemRoutingModule} from './embalagem.routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    EmbalagemRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    FormsModule,
    ReactiveFormsModule

  ],
  declarations: [
    EmbalagemCadastroComponent,
    EmbalagemEditarComponent,
    EmbalagemComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class EmbalagemModule { }

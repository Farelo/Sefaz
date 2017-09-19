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
import {PlataformaCadastrarComponent} from './plataforma-cadastrar/plataforma-cadastrar.component';
import {PlataformaEditarComponent} from './plataforma-editar/plataforma-editar.component';
import {PlataformaComponent} from './plataforma.component';
import {PlataformaRoutingModule} from './plataforma.routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PlataformaRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    FormsModule,
    ReactiveFormsModule

  ],
  declarations: [
    PlataformaCadastrarComponent,
    PlataformaEditarComponent,
    PlataformaComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class PlataformaModule { }

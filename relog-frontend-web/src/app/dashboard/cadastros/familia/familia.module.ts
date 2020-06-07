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
import { NgSelectModule } from '@ng-select/ng-select';
import { FamiliaCadastroComponent } from './familia-cadastro/familia-cadastro.component';
import { FamiliaEditarComponent } from './familia-editar/familia-editar.component';
import { FamiliaComponent } from './familia.component';
import { FamiliaRoutingModule } from './familia.routing.module';
import { ApplicationPipes } from 'app/shared/pipes/application.pipes';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FamiliaRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    ApplicationPipes,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TranslateModule
  ],
  declarations: [
    FamiliaCadastroComponent,
    FamiliaEditarComponent,
    FamiliaComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class FamiliaModule { }

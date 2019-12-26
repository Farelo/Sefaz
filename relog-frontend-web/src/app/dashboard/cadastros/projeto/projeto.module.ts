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
import { ProjetoRoutingModule } from './projeto.routing.module';
import { ProjetoCadastrarComponent } from './projeto-cadastrar/projeto-cadastrar.component';
import { ProjetoEditarComponent } from './projeto-editar/projeto-editar.component';
import { ProjetoComponent } from './projeto.component';
import { ApplicationPipes } from 'app/shared/pipes/application.pipes';
import { TranslateSettingsModule } from 'app/shared/translate/translateSettings.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ProjetoRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    ApplicationPipes,
    FormsModule,
    ReactiveFormsModule,
    TranslateSettingsModule 
  ],
  declarations: [
    ProjetoCadastrarComponent,
    ProjetoEditarComponent,
    ProjetoComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class ProjetoModule { }

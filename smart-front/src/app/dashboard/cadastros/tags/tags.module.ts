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
import {TagsCadastrarComponent} from './tags-cadastrar/tags-cadastrar.component';
import {TagsEditarComponent} from './tags-editar/tags-editar.component';
import {TagsComponent} from './tags.component';
import {TagsRoutingModule} from './tags.routing.module';
import { ApplicationPipes } from 'app/shared/pipes/application.pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TagsRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    ApplicationPipes,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    TagsCadastrarComponent,
    TagsEditarComponent,
    TagsComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class TagsModule { }

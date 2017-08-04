import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { TimelineComponent } from './timeline/timeline.component';
import { DetalhesComponent } from './timeline/detalhes/detalhes.component';
import { ListaComponent } from './lista/lista.component';

import { HomeRoutingModule } from './home.routing.module';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule,TooltipModule } from 'ngx-bootstrap'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    TimelineComponent,
    DetalhesComponent,
    ListaComponent
  ],
  providers: [
    NgbActiveModal,
  ],
})
export class HomeModule { }

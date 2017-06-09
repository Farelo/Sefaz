import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { TimelineComponent } from './timeline/timeline.component';

import { HomeRoutingModule } from './home.routing.module';
import { EmbalagensService } from '../servicos/embalagens.service';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DetalhesComponent } from './timeline/detalhes/detalhes.component';
import { ListaComponent } from './lista/lista.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
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
    EmbalagensService
  ],
})
export class HomeModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { HomeInfoComponent } from './home-info/home-info.component';
import { HomeTimelineComponent } from './home-timeline/home-timeline.component';

import { HomeRoutingModule } from './home.routing.module';
import { EmbalagensService } from '../servicos/embalagens.service';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    HomeInfoComponent,
    HomeTimelineComponent
  ],
  providers: [
    NgbActiveModal,
    EmbalagensService
  ],
})
export class HomeModule { }

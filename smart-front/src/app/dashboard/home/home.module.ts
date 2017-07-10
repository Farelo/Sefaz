import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { TimelineComponent } from './timeline/timeline.component';

import { HomeRoutingModule } from './home.routing.module';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DetalhesComponent } from './timeline/detalhes/detalhes.component';
import { ListaComponent } from './lista/lista.component';
import { ModalModule } from 'ngx-bootstrap/modal'
// import { AlertModule } from 'ngx-bootstrap';
// import * as NG2Bootstrap from 'ng2-bootstrap';
// import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    // AlertModule.forRoot(),
    // NG2Bootstrap.AlertModule,
    // ModalModule.forRoot(),
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
    // NG2Bootstrap.AlertModule,
  // NG2Bootstrap.ModalModule,
  ],
})
export class HomeModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';

import { DashboardRoutingModule } from './dashboard.routing.module';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    DashboardRoutingModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class DashboardModule { }

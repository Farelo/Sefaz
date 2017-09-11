import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BrowserXhr } from '@angular/http';
import { NgProgressBrowserXhr, NgProgressModule } from 'ngx-progressbar';
import { NgxPaginationModule} from 'ngx-pagination';
import * as $ from 'jquery';
import { AppComponent } from './app.component';
import { ModalRastComponent } from './shared/modal-rast/modal-rast.component';
import { ModalUserComponent } from './shared/modal-user/modal-user.component';
import { ModalInvComponent } from './shared/modal-inv/modal-inv.component';

import { ApplicationPipes } from './shared/pipes/application.pipes';
import {ValidatorsModule, EmailValidators} from 'ngx-validators'

import { PositionModalComponent } from './shared/modal/alerta/position/alerta.component';
import { MissingModalComponent } from './shared/modal/alerta/missing/alerta.component';
import { ModalDeleteComponent } from './shared/modal-delete/modal-delete.component';

import { AlertsService } from './servicos/alerts.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { ToastService } from './servicos/toast.service';
import { InventoryService } from './servicos/inventory.service';
import { DepartmentService } from './servicos/departments.service';
import { PackingService } from './servicos/packings.service';
import { PlantsService } from './servicos/plants.service';
import { RoutesService } from './servicos/routes.service';
import { SuppliersService } from './servicos/suppliers.service';
import { TagsService } from './servicos/tags.service';
import { AuthenticationService } from './servicos/auth.service';
import { CheckpointService } from './servicos/checkpoints.service';
import { GeocodingService } from './servicos/geocoding.service';
import { ProjectService } from './servicos/projects.service';
import { ProfileService } from './servicos/profile.service';
import { CEPService } from './servicos/cep.service';
import { GC16Service } from './servicos/gc16.service';
import { ChatService } from './servicos/teste';
import { NguiMapModule } from '@ngui/map';
import { AppRoutingModule } from './app.routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { AuthGuard } from './guard/auth.guard';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [
    AppComponent,
    PositionModalComponent,
    ModalRastComponent,
    ModalUserComponent,
    ModalInvComponent,
    ModalDeleteComponent,
    MissingModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    AlertModule.forRoot(),
    DashboardModule,
    ReactiveFormsModule,
    ValidatorsModule,
    AppRoutingModule,
    TextMaskModule,
    NgProgressModule,
    NgxPaginationModule,
    ApplicationPipes,
    NguiMapModule.forRoot({
      apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyDxZgf7T1S7LCVhXMPjDklRIcSqZfAE3WQ' +
      '&libraries=visualization,places,drawing',
    })

  ],
  providers: [
    AlertsService,
    DepartmentService,
    PackingService,
    PlantsService,
    RoutesService,
    SuppliersService,
    TagsService,
    CheckpointService,
    ProjectService,
    ChatService,
    GC16Service,
    GeocodingService,
    ProfileService,
    AuthGuard,
    InventoryService,
    CEPService,
    ToastService,
    AuthenticationService,
    { provide: BrowserXhr, useClass: NgProgressBrowserXhr }

    // FormBuilder,
    // RadioControlRegistry
  ],
  bootstrap: [AppComponent],
  exports: [ReactiveFormsModule],
  entryComponents: [ModalRastComponent,PositionModalComponent,MissingModalComponent, ModalUserComponent, ModalInvComponent, ModalDeleteComponent]
})

export class AppModule { }

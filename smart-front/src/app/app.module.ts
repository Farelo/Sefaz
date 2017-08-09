import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BrowserXhr } from '@angular/http';
import { NgProgressBrowserXhr, NgProgressModule } from 'ngx-progressbar';
import * as $ from 'jquery';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ModalRastComponent } from './shared/modal-rast/modal-rast.component';
import { ModalUserComponent } from './shared/modal-user/modal-user.component';

import {ValidatorsModule, EmailValidators} from 'ngx-validators'

import { PositionModalComponent } from './shared/modal/alerta/position/alerta.component';
import { MissingModalComponent } from './shared/modal/alerta/missing/alerta.component';

import { AlertsService } from './servicos/alerts.service';
import { InventoryService } from './servicos/inventory.service';
import { DepartmentService } from './servicos/departments.service';
import { PackingService } from './servicos/packings.service';
import { PlantsService } from './servicos/plants.service';
import { RoutesService } from './servicos/routes.service';
import { SuppliersService } from './servicos/suppliers.service';
import { TagsService } from './servicos/tags.service';
import { CheckpointService } from './servicos/checkpoints.service';
import { ProjectService } from './servicos/projects.service';
import { GC16Service } from './servicos/gc16.service';
import { ChatService } from './servicos/teste';

import { DashboardModule } from './dashboard/dashboard.module';
import { AppRoutingModule } from './app.routing.module';
import { EsqueciMinhaSenhaComponent } from './esqueci-minha-senha/esqueci-minha-senha.component';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    PositionModalComponent,
    ModalRastComponent,
    ModalUserComponent,
    MissingModalComponent,
    EsqueciMinhaSenhaComponent,
    RedefinirSenhaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    DashboardModule,
    ReactiveFormsModule,
    ValidatorsModule,
    AppRoutingModule,
    NgProgressModule

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
    InventoryService,
    { provide: BrowserXhr, useClass: NgProgressBrowserXhr }

    // FormBuilder,
    // RadioControlRegistry
  ],
  bootstrap: [AppComponent],
  exports: [ReactiveFormsModule],
  entryComponents: [ModalRastComponent,PositionModalComponent,MissingModalComponent, ModalUserComponent]
})

export class AppModule { }

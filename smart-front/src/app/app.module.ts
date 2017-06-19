import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ModalComponent } from './shared/modal/modal.component';
import { AlertaComponent } from './shared/alerta/alerta.component';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

import { EmbalagensService } from './servicos/embalagens.service';
import { AlertsService } from './servicos/alerts.service';
import { DepartmentService } from './servicos/departments.service';
import { PackingService } from './servicos/packings.service';
import { PlantsService } from './servicos/plants.service';
import { RoutesService } from './servicos/routes.service';
import { SuppliersService } from './servicos/suppliers.service';
import { TagsService } from './servicos/tags.service';
import { CheckpointService } from './servicos/checkpoints.service';
import { ProjectService } from './servicos/projects.service';

import { DashboardModule } from './dashboard/dashboard.module';
import { AppRoutingModule } from './app.routing.module';
import { ModalRastComponent } from './shared/modal-rast/modal-rast.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
    LoginComponent,
    AlertaComponent,
    LandingPageComponent,
    ModalRastComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    DashboardModule,
    AppRoutingModule
  ],
  providers: [
    EmbalagensService,
    AlertsService,
    DepartmentService,
    PackingService,
    PlantsService,
    RoutesService,
    SuppliersService,
    TagsService,
    CheckpointService,
    ProjectService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent, ModalRastComponent]
})

export class AppModule { }

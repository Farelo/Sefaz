import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ImportarComponent } from './importar/importar.component';
import { InventarioComponent } from './inventario/inventario.component';
import { ModalComponent } from './shared/modal/modal.component';

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

import { HomeModule } from './home/home.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CadastrosModule } from './cadastros/cadastros.module';
import { AppRoutingModule } from './app.routing.module';
import { LoginComponent } from './login/login.component';
import { AlertaComponent } from './shared/alerta/alerta.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ImportarComponent,
    InventarioComponent,
    ModalComponent,
    LoginComponent,
    AlertaComponent,
    LandingPageComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    HomeModule,
    DashboardModule,
    CadastrosModule,
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
  entryComponents: [ModalComponent]
})

export class AppModule { }

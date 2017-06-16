import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeModule } from './home/home.module';
import { CadastrosModule } from './cadastros/cadastros.module';
import { RastreamentoModule } from './rastreamento/rastreamento.module';

import { DashboardRoutingModule } from './dashboard.routing.module';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { InventarioComponent } from './inventario/inventario.component';
import { ImportarComponent } from './importar/importar.component';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HomeModule,
    CadastrosModule,
    RastreamentoModule,
    NgbModule.forRoot(),
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    NavbarComponent,
    InventarioComponent,
    ImportarComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class DashboardModule { }

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

import { HomeModule } from './home/home.module';
import { CadastrosModule } from './cadastros/cadastros.module';
import { AppRoutingModule } from './app.routing.module';

import { EmbalagensService } from './servicos/embalagens.service';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ImportarComponent,
    InventarioComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    HomeModule,
    CadastrosModule,
    AppRoutingModule
  ],
  providers: [
    EmbalagensService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})

export class AppModule { }

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
import { ApplicationPipes } from './shared/pipes/application.pipes';
import {ValidatorsModule, EmailValidators} from 'ngx-validators'
import { ModalDeleteComponent } from './shared/modal-delete/modal-delete.component';
import { DashboardModuleAdmin } from './admin/dashboard/dashboard.module';
import { ToastService } from './servicos/toast.service';
import { AuthenticationService } from './servicos/auth.service';
import { UserService } from './servicos/user.service';
import { NguiMapModule } from '@ngui/map';
import { AppRoutingModule } from './app.routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { AuthGuard } from './guard/auth.guard';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [
    AppComponent,
    ModalDeleteComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    AlertModule.forRoot(),
    DashboardModuleAdmin,
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

    UserService,
    AuthGuard,
    ToastService,
    AuthenticationService,
    { provide: BrowserXhr, useClass: NgProgressBrowserXhr }

    // FormBuilder,
    // RadioControlRegistry
  ],
  bootstrap: [AppComponent],
  exports: [ReactiveFormsModule],
  entryComponents: [ModalDeleteComponent]
})

export class AppModule { }

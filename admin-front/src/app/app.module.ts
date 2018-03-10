import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgProgressBrowserXhr, NgProgressModule , NgProgressInterceptor} from 'ngx-progressbar';
import { NgxPaginationModule} from 'ngx-pagination';
import * as $ from 'jquery';
import { AppComponent } from './app.component';
import { ApplicationPipes } from './shared/pipes/application.pipes';
import {ValidatorsModule, EmailValidators} from 'ngx-validators'
import { ModalDeleteComponent } from './shared/modal-delete/modal-delete.component';
import { DashboardModuleAdmin } from './dashboard/dashboard.module';
import { ToastService } from './servicos/toast.service';
import { UserService } from './servicos/user.service';
import { AuthenticationService } from './servicos/auth.service';
import { AppRoutingModule } from './app.routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ToastyModule } from 'ng2-toasty';
import { AuthInterceptor } from './interceptor/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ModalDeleteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgbModule.forRoot(),
    AlertModule.forRoot(),
    ToastyModule.forRoot(),
    DashboardModuleAdmin,
    AngularMultiSelectModule,
    ReactiveFormsModule,
    ValidatorsModule,
    AppRoutingModule,
    TextMaskModule,
    NgProgressModule,
    NgxPaginationModule,
    ApplicationPipes


  ],
  providers: [

    ToastService,
    AuthenticationService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NgProgressInterceptor,
      multi: true
    }

    // FormBuilder,
    // RadioControlRegistry
  ],
  bootstrap: [AppComponent],
  exports: [ReactiveFormsModule],
  entryComponents: [ModalDeleteComponent]
})

export class AppModule { }

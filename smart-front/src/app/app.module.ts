import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgProgressBrowserXhr, NgProgressModule , NgProgressInterceptor} from 'ngx-progressbar';
import { NgxPaginationModule} from 'ngx-pagination';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as $ from 'jquery';
import { AppComponent } from './app.component';
import { ModalRastComponent } from './shared/modal-rast/modal-rast.component';
import { ModalUserComponent } from './shared/modal-user/modal-user.component';
import { ModalSupplierRegisterComponent } from './shared/modal-user/modal-register-supplier/modal-register-supplier.component';
import { ModalLogisticRegisterComponent } from './shared/modal-user/modal-register-logistic/modal-register-logistic.component';
import { ModalStaffRegisterComponent } from './shared/modal-user/modal-register-staff/modal-register-staff.component';
import { ModalSupplierEditarComponent } from './shared/modal-user/modal-editar-supplier/modal-editar-supplier.component';
import { ModalLogisticEditarComponent } from './shared/modal-user/modal-editar-logistic/modal-editar-logistic.component';
import { ModalCurrentEditarComponent } from './shared/modal-current-edit/modal-editar-current.component';
import { ModalStaffEditarComponent } from './shared/modal-user/modal-editar-staff/modal-editar-staff.component';
import { AbscenseModalComponent } from './shared/modal-packing-absence/abscense.component';
import { ModalSettings } from './shared/modal-settings/modal-settings.component';
import { ModalInvComponent } from './shared/modal-inv/modal-inv.component';
import { ApplicationPipes } from './shared/pipes/application.pipes';
import { ValidatorsModule, EmailValidators} from 'ngx-validators'
import { AlertaModalComponent } from './shared/modal-alerta/alerta.component';
import { LayerModalComponent } from './shared/modal-packing/layer.component';
import { ModalDeleteComponent } from './shared/modal-delete/modal-delete.component';
import { DashboardModuleAdmin } from './dashboard/dashboard.module';
import { ChatService } from './servicos/teste';
import { NguiMapModule } from '@ngui/map';
import { AppRoutingModule } from './app.routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ToastyModule } from 'ng2-toasty';
import { NouisliderModule } from 'ng2-nouislider';
import { ServicesModule, AuthInterceptor } from './servicos/service.module';
import { constants } from './../environments/constants';

@NgModule({
  declarations: [
    AppComponent,
    AlertaModalComponent,
    ModalRastComponent,
    ModalUserComponent,
    ModalSupplierEditarComponent,
    ModalInvComponent,
    ModalDeleteComponent,
    ModalSettings,
    LayerModalComponent,
    ModalSupplierRegisterComponent,
    ModalLogisticRegisterComponent,
    ModalLogisticEditarComponent,
    ModalStaffRegisterComponent,
    ModalStaffEditarComponent,
    ModalCurrentEditarComponent,
    AbscenseModalComponent
  ],
  imports: [
    BrowserModule,
    ServicesModule,
    FormsModule,
    HttpModule,
    JWBootstrapSwitchModule,
    HttpClientModule,
    NouisliderModule,
    NgbModule.forRoot(),
    AlertModule.forRoot(),
    ToastyModule.forRoot(),
    BrowserAnimationsModule,
    DashboardModuleAdmin,
    AngularMultiSelectModule,
    ReactiveFormsModule,
    ValidatorsModule,
    AppRoutingModule,
    TextMaskModule,
    NgProgressModule,
    NgxPaginationModule,
    ApplicationPipes,
    NguiMapModule.forRoot({
      apiUrl: `https://maps.google.com/maps/api/js?key=${constants.GOOGLE_API_KEY}` +
      '&libraries=visualization,places,drawing',
    })

  ],
  providers: [
    ChatService,
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

  ],
  bootstrap: [AppComponent],
  exports: [ReactiveFormsModule],
  entryComponents: [ModalRastComponent, AbscenseModalComponent, AlertaModalComponent,ModalSettings,ModalCurrentEditarComponent,LayerModalComponent,ModalStaffEditarComponent, ModalUserComponent, ModalStaffRegisterComponent,ModalLogisticEditarComponent,ModalInvComponent, ModalLogisticRegisterComponent,ModalDeleteComponent,ModalSupplierRegisterComponent,ModalSupplierEditarComponent]
})

export class AppModule { }

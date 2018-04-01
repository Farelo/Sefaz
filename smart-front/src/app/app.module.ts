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
import { ModalSettings } from './shared/modal-settings/modal-settings.component';
import { ModalInvComponent } from './shared/modal-inv/modal-inv.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ApplicationPipes } from './shared/pipes/application.pipes';
import { ValidatorsModule, EmailValidators} from 'ngx-validators'
import { AlertaModalComponent } from './shared/modal-alerta/alerta.component';
import { LayerModalComponent } from './shared/modal-packing/layer.component';
import { ModalDeleteComponent } from './shared/modal-delete/modal-delete.component';
import { AlertsService } from './servicos/alerts.service';
import { ImportService } from './servicos/import.service';
import { SettingsService } from './servicos/settings.service';
import { DashboardModuleAdmin } from './dashboard/dashboard.module';
import { ToastService } from './servicos/toast.service';
import { InventoryService } from './servicos/inventory.service';
import { DepartmentService } from './servicos/departments.service';
import { PackingService } from './servicos/packings.service';
import { LogisticService } from './servicos/logistic.service';
import { InventoryLogisticService } from './servicos/inventory_logistic.service';
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
import { AlertModule } from 'ngx-bootstrap/alert';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ToastyModule } from 'ng2-toasty';
import { NouisliderModule } from 'ng2-nouislider';

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
    ModalCurrentEditarComponent
  ],
  imports: [
    BrowserModule,
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
    SettingsService,
    TagsService,
    CheckpointService,
    InventoryLogisticService,
    ProjectService,
    ChatService,
    GC16Service,
    GeocodingService,
    ProfileService,
    InventoryService,
    CEPService,
    LogisticService,
    ToastService,
    ImportService,
    AuthenticationService,
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
  entryComponents: [ModalRastComponent, AlertaModalComponent,ModalSettings,ModalCurrentEditarComponent,LayerModalComponent,ModalStaffEditarComponent, ModalUserComponent, ModalStaffRegisterComponent,ModalLogisticEditarComponent,ModalInvComponent, ModalLogisticRegisterComponent,ModalDeleteComponent,ModalSupplierRegisterComponent,ModalSupplierEditarComponent]
})

export class AppModule { }

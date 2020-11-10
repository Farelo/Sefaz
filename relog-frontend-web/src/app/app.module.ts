import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import {
  NgbModule,
  NgbModal,
  NgbActiveModal,
  NgbModalOptions
} from "@ng-bootstrap/ng-bootstrap";
import {
  NgProgressBrowserXhr,
  NgProgressModule,
  NgProgressInterceptor
} from "ngx-progressbar";
import { NgxPaginationModule } from "ngx-pagination";
import { JWBootstrapSwitchModule } from "jw-bootstrap-switch-ng2";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import * as $ from "jquery";
import { AppComponent } from "./app.component";
import { ModalRastComponent } from "./shared/modal-rast/modal-rast.component";
import { ModalUserComponent } from "./shared/modal-user/modal-user.component";
import { ModalLogisticRegisterComponent } from "./shared/modal-user/modal-register-logistic/modal-register-logistic.component";
import { AbscenseModalComponent } from "./shared/modal-packing-absence/abscense.component";
import { ModalSettings } from "./shared/modal-settings/modal-settings.component";
import { ModalInvComponent } from "./shared/modal-inv/modal-inv.component";
import { ApplicationPipes } from "./shared/pipes/application.pipes";
import { ValidatorsModule, EmailValidators } from "ngx-validators";
import { AlertaModalComponent } from "./shared/modal-alerta/alerta.component";
import { LayerModalComponent } from "./shared/modal-packing/layer.component";
import { ModalDeleteComponent } from "./shared/modal-delete/modal-delete.component";
import { DashboardModuleAdmin } from "./dashboard/dashboard.module";
import { ChatService } from "./servicos/teste";
import { NguiMapModule } from "@ngui/map";
import { AppRoutingModule } from "./app.routing.module";
import { TextMaskModule } from "angular2-text-mask";
import { AlertModule } from "ngx-bootstrap/alert";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown/angular2-multiselect-dropdown";
import { ToastyModule } from "ng2-toasty";
import { NouisliderModule } from "ng2-nouislider";
import { ServicesModule, AuthInterceptor } from "./servicos/service.module";
import { constants } from "./../environments/constants";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TooltipModule } from "ngx-bootstrap";
import { AlertaAusenteComponent } from "./shared/modal-alerta/alerta-ausente/alerta-ausente.component";
import { AlertaBateriaBaixaComponent } from "./shared/modal-alerta/alerta-bateria-baixa/alerta-bateria-baixa.component";
import { AlertaEmbalagemAtrasadaComponent } from "./shared/modal-alerta/alerta-embalagem-atrasada/alerta-embalagem-atrasada.component";
import { AlertaLocalIncorretoComponent } from "./shared/modal-alerta/alerta-local-incorreto/alerta-local-incorreto.component";
import { AlertaPermanenciaComponent } from "./shared/modal-alerta/alerta-permanencia/alerta-permanencia.component";
import { AlertaEmbalagemPerdidaComponent } from "./shared/modal-alerta/alerta-embalagem-perdida/alerta-embalagem-perdida.component";
import { SidebarModule } from "ng-sidebar";
import { CreateUserComponent } from "./shared/modal-user/create-user/create-user.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { EditUserComponent } from "./shared/modal-user/edit-user/edit-user.component";
import { AlertaSemSinalComponent } from "./shared/modal-alerta/alerta-sem-sinal/alerta-sem-sinal.component";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    AlertaModalComponent,
    AlertaAusenteComponent,
    AlertaBateriaBaixaComponent,
    AlertaEmbalagemAtrasadaComponent,
    AlertaLocalIncorretoComponent,
    AlertaPermanenciaComponent,
    AlertaEmbalagemPerdidaComponent,
    AlertaSemSinalComponent,
    ModalRastComponent,
    ModalUserComponent,
    ModalInvComponent,
    ModalDeleteComponent,
    ModalSettings,
    LayerModalComponent,
    ModalLogisticRegisterComponent,
    AbscenseModalComponent,

    CreateUserComponent,
    EditUserComponent
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
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    SidebarModule.forRoot(),
    NgSelectModule,
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
      apiUrl: `https://maps.google.com/maps/api/js?key=${constants.GOOGLE_API_KEY}`
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
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
  exports: [ReactiveFormsModule],
  entryComponents: [
    AlertaModalComponent,
    AlertaAusenteComponent,
    AlertaBateriaBaixaComponent,
    AlertaEmbalagemAtrasadaComponent,
    AlertaLocalIncorretoComponent,
    AlertaPermanenciaComponent,
    AlertaEmbalagemPerdidaComponent,
    AlertaSemSinalComponent,
    ModalRastComponent,
    AbscenseModalComponent,
    ModalSettings,
    LayerModalComponent,
    ModalUserComponent,
    ModalInvComponent,
    ModalLogisticRegisterComponent,
    ModalDeleteComponent,

    CreateUserComponent,
    EditUserComponent
  ]
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastyModule } from 'ng2-toasty'
import { CommonModule } from '@angular/common'
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule, TooltipModule } from 'ngx-bootstrap'
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NguiMapModule } from '@ngui/map';
import { AlertModule } from 'ngx-bootstrap/alert';
import { constants } from '../../../../environments/constants'
import { CompanyRoutingModule } from './company.routing.module'; 
import { CompanyCadastrarComponent } from './company-cadastrar/company-cadastrar.component'; 
import { CompanyEditarComponent } from './company-editar/company-editar.component';
import { CompanyComponent } from './company.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TextMaskModule } from 'angular2-text-mask';
import { ApplicationPipes } from 'app/shared/pipes/application.pipes';
import { TranslateSettingsModule } from 'app/shared/translate/translateSettings.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AlertModule,
    CompanyRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    ApplicationPipes,
    FormsModule,
    TextMaskModule,
    NgSelectModule,
    ReactiveFormsModule,
    NguiMapModule.forRoot({
      apiUrl: `https://maps.google.com/maps/api/js?key=${constants.GOOGLE_API_KEY}` +
        '&libraries=visualization,places,drawing',
    }),
    TranslateSettingsModule
  ],
  declarations: [
    CompanyCadastrarComponent,
    CompanyComponent,
    CompanyEditarComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class CompanyModule { }

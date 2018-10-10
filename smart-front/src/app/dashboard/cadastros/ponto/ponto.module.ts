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
import { PontoRoutingModule } from './ponto.routing.module'; 
import { PontoCadastrarComponent } from './ponto-cadastrar/ponto-cadastrar.component'; 
import { PontoEditarComponent } from './ponto-editar/ponto-editar.component';
import { PontoComponent } from './ponto.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AlertModule,
    PontoRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NguiMapModule.forRoot({
      apiUrl: `https://maps.google.com/maps/api/js?key=${constants.GOOGLE_API_KEY}` +
        '&libraries=visualization,places,drawing',
    })

  ],
  declarations: [
    PontoCadastrarComponent,
    PontoComponent,
    PontoEditarComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class PontoModule { }

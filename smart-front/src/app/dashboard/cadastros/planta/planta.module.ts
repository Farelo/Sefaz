
/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToastyModule} from 'ng2-toasty'
import { CommonModule } from '@angular/common'
import { NgxPaginationModule} from 'ngx-pagination';
import { ModalModule ,TooltipModule} from 'ngx-bootstrap'
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import {PlantaCadastrarComponent} from './planta-cadastrar/planta-cadastrar.component';
import {PlantaEditarComponent} from './planta-editar/planta-editar.component';
import {PlantaComponent} from './planta.component';
import {PlantaRoutingModule} from './planta.routing.module';
import { NguiMapModule } from '@ngui/map';
import {AlertModule } from 'ngx-bootstrap/alert';
import {constants} from '../../../../environments/constants'
import { ApplicationPipes } from 'app/shared/pipes/application.pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AlertModule,
    PlantaRoutingModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    ToastyModule.forRoot(),
    ApplicationPipes,
    FormsModule,
    ReactiveFormsModule,
    NguiMapModule.forRoot({
      apiUrl: `https://maps.google.com/maps/api/js?key=${constants.GOOGLE_API_KEY}` +
      '&libraries=visualization,places,drawing',
    })

  ],
  declarations: [
    PlantaCadastrarComponent,
    PlantaComponent,
    PlantaEditarComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class PlantaModule { }

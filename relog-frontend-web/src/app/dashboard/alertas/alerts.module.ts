/**
 * Created by david on 7/09/17.
 */
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';
import { ListaComponent } from './lista/lista.component';
import { alertsRoutingModule } from './alerts.routing.module';
import { CommonModule } from '@angular/common'
import { NgxPaginationModule} from 'ngx-pagination';
import { ApplicationPipes } from '../../shared/pipes/application.pipes';
import { ModalModule ,TooltipModule, PopoverModule} from 'ngx-bootstrap'
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateSettingsModule } from 'app/shared/translate/translateSettings.module';

@NgModule({
  imports: [
    alertsRoutingModule,
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    ApplicationPipes,
    PopoverModule.forRoot(),
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    TranslateSettingsModule
  ],
  declarations: [
    ListaComponent,
    TimelineComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class AlertsModule { }

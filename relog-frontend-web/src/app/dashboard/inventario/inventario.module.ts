/**
 * Created by david on 7/09/17.
 */
import { NgModule }   from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventarioComponent } from './inventario.component';
import { InventarioRoutingModule } from './inventario.routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApplicationPipes } from '../../shared/pipes/application.pipes';
//import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule, PopoverModule, BsDatepickerModule } from 'ngx-bootstrap'
import { GeralComponent } from './geral/geral.component';
import { InventarioGeralComponent } from './inventario-geral/inventario-geral.component';
import { InventarioPermanenciaComponent } from './inventario-permanencia/inventario-permanencia.component';
import { InventarioBateriaComponent } from './inventario-bateria/inventario-bateria.component';
import { InventarioQuantidadeComponent } from './inventario-quantidade/inventario-quantidade.component';
import { InventarioEquipamentoGeralComponent } from './inventario-equipamento-geral/inventario-equipamento-geral.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { InventarioAusenciaComponent } from './inventario-ausencia/inventario-ausencia.component';
import { InventarioPosicoesComponent } from './inventario-posicoes/inventario-posicoes.component';
import { InventarioTemperaturasComponent } from './inventario-temperaturas/inventario-temperaturas.component';
import { DateTimePickerComponent } from "../../shared/date-time-picker/date-time-picker.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    NgSelectModule,
    InventarioRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ApplicationPipes,
    NgbModule,
    TooltipModule,
    //Angular2Csv
    FontAwesomeModule
  ],
  declarations: [
    InventarioComponent,
    GeralComponent,
    InventarioGeralComponent,
    InventarioPermanenciaComponent,
    InventarioBateriaComponent,
    InventarioQuantidadeComponent,
    InventarioEquipamentoGeralComponent,
    FornecedorComponent,
    InventarioAusenciaComponent,
    InventarioPosicoesComponent,
    InventarioTemperaturasComponent,
    DateTimePickerComponent
  ],
  providers: [],
})
export class InventarioModule { }

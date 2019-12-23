/**
 * Created by david on 7/09/17.
 */
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing.module';
import { CommonModule } from '@angular/common'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule} from 'ngx-pagination';
import { TooltipModule, PopoverModule } from 'ngx-bootstrap'
import { ApplicationPipes } from '../../shared/pipes/application.pipes';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ResumoHomeComponent } from './resumo-home/resumo-home.component';
import { CategoriaPontosDeControleComponent } from './categoria-pontos-de-controle/categoria-pontos-de-controle.component';
import { CategoriaEmViagemComponent } from './categoria-em-viagem/categoria-em-viagem.component';
import { CategoriaSemSinalComponent } from './categoria-sem-sinal/categoria-sem-sinal.component';
import { CategoriaBateriaBaixaComponent } from './categoria-bateria-baixa/categoria-bateria-baixa.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  imports: [
    ApplicationPipes,
    HomeRoutingModule,
    CommonModule,
    NgxPaginationModule,
    NgxChartsModule,
    NgbModule,
    TooltipModule, 
    PopoverModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    HomeComponent,
    ResumoHomeComponent,
    CategoriaPontosDeControleComponent,
    CategoriaEmViagemComponent,
    CategoriaSemSinalComponent,
    CategoriaBateriaBaixaComponent
  ],
})
export class HomeModule { }

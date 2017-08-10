import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NguiMapModule } from '@ngui/map';
import { NgxPaginationModule } from 'ngx-pagination';
import { CadastrosComponent } from './cadastros.component';
// import { SelectModule } from 'ng2-select';
import { CadastrosRoutingModule } from './cadastros.routing.module';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TagsComponent } from './tags/tags.component';
import { EmbalagemComponent } from './embalagem/embalagem.component';
import { ScannerComponent } from './scanner/scanner.component';
import { SetorComponent } from './setor/setor.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { PlataformaComponent } from './plataforma/plataforma.component';
import { RotasComponent } from './rotas/rotas.component';
import { PlantaComponent } from './planta/planta.component';
import { EmbalagemCadastroComponent } from './embalagem/embalagem-cadastro/embalagem-cadastro.component';
import { EmbalagemEditarComponent } from './embalagem/embalagem-editar/embalagem-editar.component';
import { FornecedorCadastrarComponent } from './fornecedor/fornecedor-cadastrar/fornecedor-cadastrar.component';
import { PlantaCadastrarComponent } from './planta/planta-cadastrar/planta-cadastrar.component';
import { PlantaEditarComponent } from './planta/planta-editar/planta-editar.component';
import { PlataformaCadastrarComponent } from './plataforma/plataforma-cadastrar/plataforma-cadastrar.component';
import { PlataformaEditarComponent } from './plataforma/plataforma-editar/plataforma-editar.component';
import { RotasCadastrarComponent } from './rotas/rotas-cadastrar/rotas-cadastrar.component';
import { ScannerCadastrarComponent } from './scanner/scanner-cadastrar/scanner-cadastrar.component';
import { SetorCadastrarComponent } from './setor/setor-cadastrar/setor-cadastrar.component';
import { TagsCadastrarComponent } from './tags/tags-cadastrar/tags-cadastrar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // SelectModule,
    NgbModule.forRoot(),
    CadastrosRoutingModule,
    NgxPaginationModule,
    NguiMapModule.forRoot({
      apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCbMGRUwcqKjlYX4h4-P6t-xcDryRYLmCM' +
      '&libraries=visualization,places,drawing',
    })
  ],
  declarations: [
    CadastrosComponent,
    TagsComponent,
    EmbalagemComponent,
    ScannerComponent,
    SetorComponent,
    FornecedorComponent,
    PlataformaComponent,
    RotasComponent,
    PlantaComponent,
    EmbalagemCadastroComponent,
    FornecedorCadastrarComponent,
    PlantaCadastrarComponent,
    PlataformaCadastrarComponent,
    RotasCadastrarComponent,
    ScannerCadastrarComponent,
    SetorCadastrarComponent,
    TagsCadastrarComponent,
    PlantaEditarComponent,
    PlataformaEditarComponent,
    EmbalagemEditarComponent
  ],
  providers: [
    NgbActiveModal
  ],
})
export class CadastrosModule { }

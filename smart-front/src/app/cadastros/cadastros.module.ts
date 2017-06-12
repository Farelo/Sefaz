import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CadastrosComponent } from './cadastros.component';

import { CadastrosRoutingModule } from './cadastros.routing.module';
import { EmbalagensService } from '../servicos/embalagens.service';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TagsComponent } from './tags/tags.component';
import { EmbalagemComponent } from './embalagem/embalagem.component';
import { ScannerComponent } from './scanner/scanner.component';
import { SetorComponent } from './setor/setor.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { PlataformaComponent } from './plataforma/plataforma.component';
import { RotasComponent } from './rotas/rotas.component';
import { PlantaComponent } from './planta/planta.component';
import { EmbalagemDetalheComponent } from './embalagem/embalagem-detalhe/embalagem-detalhe.component';
import { EmbalagemCadastroComponent } from './embalagem/embalagem-cadastro/embalagem-cadastro.component';
import { FornecedorCadastrarComponent } from './fornecedor/fornecedor-cadastrar/fornecedor-cadastrar.component';
import { PlantaCadastrarComponent } from './planta/planta-cadastrar/planta-cadastrar.component';
import { PlataformaCadastrarComponent } from './plataforma/plataforma-cadastrar/plataforma-cadastrar.component';
import { RotasCadastrarComponent } from './rotas/rotas-cadastrar/rotas-cadastrar.component';
import { ScannerCadastrarComponent } from './scanner/scanner-cadastrar/scanner-cadastrar.component';
import { SetorCadastrarComponent } from './setor/setor-cadastrar/setor-cadastrar.component';
import { TagsCadastrarComponent } from './tags/tags-cadastrar/tags-cadastrar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    CadastrosRoutingModule
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
    EmbalagemDetalheComponent,
    EmbalagemCadastroComponent,
    FornecedorCadastrarComponent,
    PlantaCadastrarComponent,
    PlataformaCadastrarComponent,
    RotasCadastrarComponent,
    ScannerCadastrarComponent,
    SetorCadastrarComponent,
    TagsCadastrarComponent
  ],
  providers: [
    NgbActiveModal,
    EmbalagensService
  ],
})
export class CadastrosModule { }

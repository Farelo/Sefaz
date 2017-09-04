import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { CadastrosComponent } from './cadastros.component';
import { TagsComponent } from './tags/tags.component';
import { EmbalagemComponent } from './embalagem/embalagem.component';
import { ScannerComponent } from './scanner/scanner.component';
import { SetorComponent } from './setor/setor.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { PlataformaComponent } from './plataforma/plataforma.component';
import { RotasComponent } from './rotas/rotas.component';
import { PlantaComponent } from './planta/planta.component';
import { EmbalagemCadastroComponent }from './embalagem/embalagem-cadastro/embalagem-cadastro.component';
import { EmbalagemEditarComponent }from './embalagem/embalagem-editar/embalagem-editar.component';
import { FornecedorCadastrarComponent } from './fornecedor/fornecedor-cadastrar/fornecedor-cadastrar.component';
import { PlantaCadastrarComponent } from './planta/planta-cadastrar/planta-cadastrar.component';
import { PlantaEditarComponent } from './planta/planta-editar/planta-editar.component';
import { PlataformaCadastrarComponent } from './plataforma/plataforma-cadastrar/plataforma-cadastrar.component';
import { PlataformaEditarComponent } from './plataforma/plataforma-editar/plataforma-editar.component';
import { RotasCadastrarComponent } from './rotas/rotas-cadastrar/rotas-cadastrar.component';
import { ScannerCadastrarComponent } from './scanner/scanner-cadastrar/scanner-cadastrar.component';
import { SetorCadastrarComponent } from './setor/setor-cadastrar/setor-cadastrar.component';
import { SetorEditarComponent } from './setor/setor-editar/setor-editar.component';
import { TagsCadastrarComponent } from './tags/tags-cadastrar/tags-cadastrar.component';
import { TagsEditarComponent } from './tags/tags-editar/tags-editar.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';


const CadastrosRoutes = [
  {path: 'rc', component: DashboardComponent, children: [
     {path: 'cadastros', component: CadastrosComponent, children: [
      {path: '', redirectTo: '/rc/cadastros/tags', pathMatch: 'full'},
      {path: 'tags', component: TagsComponent},
      {path: 'tags/cadastrar', component: TagsCadastrarComponent},
      {path: 'tags/editar/:id', component: TagsEditarComponent},
      {path: 'scanner', component: ScannerComponent},
      {path: 'scanner/cadastrar', component: ScannerCadastrarComponent},
      {path: 'embalagem', component: EmbalagemComponent},
      {path: 'embalagem/cadastrar', component: EmbalagemCadastroComponent},
      {path: 'embalagem/editar/:id', component: EmbalagemEditarComponent},
      {path: 'setor', component: SetorComponent},
      {path: 'setor/cadastrar', component: SetorCadastrarComponent},
      {path: 'setor/editar/:id', component: SetorEditarComponent},
      {path: 'fornecedor', component: FornecedorComponent},
      {path: 'fornecedor/cadastrar', component: FornecedorCadastrarComponent},
      {path: 'plataforma', component: PlataformaComponent},
      {path: 'plataforma/cadastrar', component: PlataformaCadastrarComponent},
      {path: 'plataforma/editar/:id', component: PlataformaEditarComponent},
      {path: 'rotas', component: RotasComponent},
      {path: 'rotas/cadastrar', component: RotasCadastrarComponent},
      {path: 'planta', component: PlantaComponent},
      {path: 'planta/cadastrar', component: PlantaCadastrarComponent},
      {path: 'planta/editar/:id', component: PlantaEditarComponent},
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(CadastrosRoutes)],
  exports: [RouterModule]
})

export class CadastrosRoutingModule {}

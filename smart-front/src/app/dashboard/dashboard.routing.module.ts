import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { TimelineComponent } from './home//timeline/timeline.component';
import { ListaComponent } from './home/lista/lista.component';
import { DashboardComponent } from './dashboard.component';
import { CadastrosComponent } from './cadastros/cadastros.component';
import { InventarioComponent } from './inventario/inventario.component';
import { ImportarComponent } from './importar/importar.component';

import { TagsComponent } from './cadastros/tags/tags.component';
import { EmbalagemComponent } from './cadastros/embalagem/embalagem.component';
import { ScannerComponent } from './cadastros/scanner/scanner.component';
import { SetorComponent } from './cadastros/setor/setor.component';
import { FornecedorComponent } from './cadastros/fornecedor/fornecedor.component';
import { PlataformaComponent } from './cadastros/plataforma/plataforma.component';
import { RotasComponent } from './cadastros/rotas/rotas.component';
import { PlantaComponent } from './cadastros/planta/planta.component';
import { EmbalagemCadastroComponent }from './cadastros/embalagem/embalagem-cadastro/embalagem-cadastro.component';
import { PlantaCadastrarComponent } from './cadastros/planta/planta-cadastrar/planta-cadastrar.component';
import { FornecedorCadastrarComponent } from './cadastros/fornecedor/fornecedor-cadastrar/fornecedor-cadastrar.component';
import { PlataformaCadastrarComponent } from './cadastros/plataforma/plataforma-cadastrar/plataforma-cadastrar.component';
import { ScannerCadastrarComponent } from './cadastros/scanner/scanner-cadastrar/scanner-cadastrar.component';
import { RotasCadastrarComponent } from './cadastros/rotas/rotas-cadastrar/rotas-cadastrar.component';
import { SetorCadastrarComponent } from './cadastros/setor/setor-cadastrar/setor-cadastrar.component';
import { TagsCadastrarComponent } from './cadastros/tags/tags-cadastrar/tags-cadastrar.component';

const dashboardRoutes = [
  {path: 'rc', component: DashboardComponent, children: [
    {path: '', redirectTo: '/rc/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent, children: [
       {path: '', component: TimelineComponent},
       {path: ':hashing', component: ListaComponent}
    ]},
     {path: 'cadastros', component: CadastrosComponent, children: [
      {path: '', redirectTo: '/rc/cadastros/tags', pathMatch: 'full'},
      {path: 'tags', component: TagsComponent},
      {path: 'tags/cadastrar', component: TagsCadastrarComponent},
      {path: 'scanner', component: ScannerComponent},
      {path: 'scanner/cadastrar', component: ScannerCadastrarComponent},
      {path: 'embalagem', component: EmbalagemComponent},
      {path: 'embalagem/cadastrar', component: EmbalagemCadastroComponent},
      {path: 'setor', component: SetorComponent},
      {path: 'setor/cadastrar', component: SetorCadastrarComponent},
      {path: 'fornecedor', component: FornecedorComponent},
      {path: 'fornecedor/cadastrar', component: FornecedorCadastrarComponent},
      {path: 'plataforma', component: PlataformaComponent},
      {path: 'plataforma/cadastrar', component: PlataformaCadastrarComponent},
      {path: 'rotas', component: RotasComponent},
      {path: 'rotas/cadastrar', component: RotasCadastrarComponent},
      {path: 'planta', component: PlantaComponent},
      {path: 'planta/cadastrar', component: PlantaCadastrarComponent},
    ]
  
},
    {path: 'inventario', component: InventarioComponent},
    {path: 'importar', component: ImportarComponent},
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {}

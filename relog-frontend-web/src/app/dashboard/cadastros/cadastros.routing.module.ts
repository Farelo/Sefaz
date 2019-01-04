import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CadastrosComponent } from './cadastros.component';

const CadastrosRoutes = [
  {
    path: '',
    component: CadastrosComponent,
    children: [
      { path: '', redirectTo: '/rc/cadastros/embalagem', pathMatch: 'full' }, 
      { path: 'tags', loadChildren: 'app/dashboard/cadastros/tags/tags.module#TagsModule' },
      { path: 'embalagem', loadChildren: 'app/dashboard/cadastros/embalagem/embalagem.module#EmbalagemModule' },
      { path: 'familia', loadChildren: 'app/dashboard/cadastros/familia/familia.module#FamiliaModule' },
      { path: 'setor', loadChildren: 'app/dashboard/cadastros/setor/setor.module#SetorModule' },
      { path: 'projeto', loadChildren: 'app/dashboard/cadastros/projeto/projeto.module#ProjetoModule' },
      { path: 'rotas', loadChildren: 'app/dashboard/cadastros/rotas/rotas.module#RotasModule' },
      { path: 'planta', loadChildren: 'app/dashboard/cadastros/planta/planta.module#PlantaModule' },
      { path: 'ponto', loadChildren: 'app/dashboard/cadastros/ponto-de-controle/ponto-de-controle.module#PontoDeControleModule' },
      { path: 'company', loadChildren: 'app/dashboard/cadastros/company/company.module#CompanyModule' },
      { path: 'tipo-ponto-controle', loadChildren: 'app/dashboard/cadastros/tipo-ponto-controle/company.module#CompanyModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(CadastrosRoutes)],
  exports: [RouterModule]
})

export class CadastrosRoutingModule { }

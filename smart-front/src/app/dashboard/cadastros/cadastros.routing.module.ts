import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CadastrosComponent } from './cadastros.component';

const CadastrosRoutes = [
  {
    path: '',
    component: CadastrosComponent,
    children: [
      { path: '', redirectTo: '/rc/cadastros/tags', pathMatch: 'full' },
      { path: 'tags', loadChildren: 'app/dashboard/cadastros/tags/tags.module#TagsModule' },
      { path: 'embalagem', loadChildren: 'app/dashboard/cadastros/embalagem/embalagem.module#EmbalagemModule' },
      { path: 'familia', loadChildren: 'app/dashboard/cadastros/familia/familia.module#FamiliaModule' },
      { path: 'setor', loadChildren: 'app/dashboard/cadastros/setor/setor.module#SetorModule' },
      { path: 'plataforma', loadChildren: 'app/dashboard/cadastros/plataforma/plataforma.module#PlataformaModule' },
      { path: 'rotas', loadChildren: 'app/dashboard/cadastros/rotas/rotas.module#RotasModule' },
      { path: 'planta', loadChildren: 'app/dashboard/cadastros/planta/planta.module#PlantaModule' },
      { path: 'company', loadChildren: 'app/dashboard/cadastros/company/company.module#CompanyModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(CadastrosRoutes)],
  exports: [RouterModule]
})

export class CadastrosRoutingModule { }

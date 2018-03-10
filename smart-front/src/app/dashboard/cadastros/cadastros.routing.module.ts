import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CadastrosComponent } from './cadastros.component';

const CadastrosRoutes = [
  {
           path: '',
           component: CadastrosComponent,
           children: [
             {path: '', redirectTo: '/rc/cadastros/tags', pathMatch: 'full'},
             {path: 'tags', loadChildren: 'app/admin/dashboard/cadastros/tags/tags.module#TagsModule'},
             {path: 'embalagem',loadChildren: 'app/admin/dashboard/cadastros/embalagem/embalagem.module#EmbalagemModule'},
             {path: 'setor',loadChildren: 'app/admin/dashboard/cadastros/setor/setor.module#SetorModule'},
             {path: 'plataforma', loadChildren: 'app/admin/dashboard/cadastros/plataforma/plataforma.module#PlataformaModule'},
             {path: 'rotas', loadChildren: 'app/admin/dashboard/cadastros/rotas/rotas.module#RotasModule'},
             {path: 'planta',loadChildren: 'app/admin/dashboard/cadastros/planta/planta.module#PlantaModule'},
           ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(CadastrosRoutes)],
  exports: [RouterModule]
})

export class CadastrosRoutingModule { }

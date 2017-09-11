import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CadastrosComponent } from './cadastros.component';
import { AuthGuard } from '../../guard/auth.guard';

const CadastrosRoutes = [
  {
           path: '',
           component: CadastrosComponent,
           canActivate: [AuthGuard],
           children: [
             {path: '', redirectTo: '/rc/cadastros/tags', pathMatch: 'full'},
             {path: 'tags', loadChildren: 'app/dashboard/cadastros/tags/tags.module#TagsModule'},
             {path: 'embalagem',loadChildren: 'app/dashboard/cadastros/embalagem/embalagem.module#EmbalagemModule'},
             {path: 'setor',loadChildren: 'app/dashboard/cadastros/setor/setor.module#SetorModule'},
             {path: 'plataforma', loadChildren: 'app/dashboard/cadastros/plataforma/plataforma.module#PlataformaModule'},
             {path: 'rotas', loadChildren: 'app/dashboard/cadastros/rotas/rotas.module#RotasModule'},
             {path: 'planta',loadChildren: 'app/dashboard/cadastros/planta/planta.module#PlantaModule'},
           ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(CadastrosRoutes)],
  exports: [RouterModule]
})

export class CadastrosRoutingModule { }

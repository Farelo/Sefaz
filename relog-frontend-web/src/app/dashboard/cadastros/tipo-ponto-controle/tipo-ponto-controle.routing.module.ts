import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProjetoComponent } from './projeto.component';
import { TipoCadastrarComponent } from './tipo-cadastrar/tipo-cadastrar.component';
import { TipoEditarComponent } from './tipo-editar/tipo-editar.component';

const projetoRoutes = [
  {path: '', component: ProjetoComponent},
  { path: 'cadastrar', component: TipoCadastrarComponent},
  { path: 'editar/:id', component: TipoEditarComponent},
];

@NgModule({
  imports: [RouterModule.forChild(projetoRoutes)],
  exports: [RouterModule]
})

export class ProjetoRoutingModule {}

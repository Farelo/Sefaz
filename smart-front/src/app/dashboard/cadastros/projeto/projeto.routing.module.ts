import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProjetoComponent } from './projeto.component';
import { ProjetoCadastrarComponent } from './projeto-cadastrar/projeto-cadastrar.component';
import { ProjetoEditarComponent } from './projeto-editar/projeto-editar.component';

const projetoRoutes = [
  {path: '', component: ProjetoComponent},
  { path: 'cadastrar', component: ProjetoCadastrarComponent},
  { path: 'editar/:id', component: ProjetoEditarComponent},
];

@NgModule({
  imports: [RouterModule.forChild(projetoRoutes)],
  exports: [RouterModule]
})

export class ProjetoRoutingModule {}

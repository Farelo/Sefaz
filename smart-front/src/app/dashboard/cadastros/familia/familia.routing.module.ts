import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FamiliaComponent } from './familia.component';
import { FamiliaCadastroComponent } from './familia-cadastro/familia-cadastro.component';
import { FamiliaEditarComponent } from './familia-editar/familia-editar.component';

const familiaRoutes = [
  { path: '', component: FamiliaComponent},
  {path: 'cadastrar', component: FamiliaCadastroComponent},
  { path: 'editar/:id', component: FamiliaEditarComponent},

];

@NgModule({
  imports: [RouterModule.forChild(familiaRoutes)],
  exports: [RouterModule]
})

export class FamiliaRoutingModule {}

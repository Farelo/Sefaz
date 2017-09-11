import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {SetorCadastrarComponent} from './setor-cadastrar/setor-cadastrar.component';
import {SetorEditarComponent} from './setor-editar/setor-editar.component';
import {SetorComponent} from './setor.component';

const setorRoutes = [
  {path: '', component: SetorComponent},
  {path: 'cadastrar', component: SetorCadastrarComponent},
  {path: 'editar/:id', component: SetorEditarComponent},
];

@NgModule({
  imports: [RouterModule.forChild(setorRoutes)],
  exports: [RouterModule]
})

export class SetorRoutingModule {}

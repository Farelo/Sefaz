import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {RotasCadastrarComponent} from './rotas-cadastrar/rotas-cadastrar.component';
import {RotasComponent} from './rotas.component';

const rotasRoutes = [
  {path: '', component: RotasComponent},
  {path: 'cadastrar', component: RotasCadastrarComponent},


];

@NgModule({
  imports: [RouterModule.forChild(rotasRoutes)],
  exports: [RouterModule]
})

export class RotasRoutingModule {}

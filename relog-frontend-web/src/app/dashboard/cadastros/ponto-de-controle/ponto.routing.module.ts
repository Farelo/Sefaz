import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PontoDeControleComponent } from './ponto-de-controle.component';
import { PontoDeControleCadastrarComponent } from './ponto-de-controle-cadastrar/ponto-de-controle-cadastrar.component';
import { PontoDeControleEditarComponent } from './ponto-de-controle-editar/ponto-de-controle-editar.component';

const pontoRoutes = [
  { path: '', component: PontoDeControleComponent},
  { path: 'cadastrar', component: PontoDeControleCadastrarComponent},
  { path: 'editar/:id', component: PontoDeControleEditarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(pontoRoutes)],
  exports: [RouterModule]
})

export class PlantaRoutingModule {}

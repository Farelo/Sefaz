import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';  
import { PontoCadastrarComponent } from './ponto-cadastrar/ponto-cadastrar.component'; 
import { PontoEditarComponent } from './ponto-editar/ponto-editar.component';
import { PontoComponent } from './ponto.component';

const pontoRoutes = [
  { path: '', component: PontoComponent },
  { path: 'cadastrar', component: PontoCadastrarComponent },
  { path: 'editar/:id', component: PontoEditarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(pontoRoutes)],
  exports: [RouterModule]
})

export class PontoRoutingModule {}

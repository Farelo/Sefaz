import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core'; 
import { TipoPontoControleComponent } from './tipo-ponto-controle.component';
import { TipoPontoControleCadastrarComponent } from './tipo-cadastrar/tipo-cadastrar.component';
import { TipoPontoControleEditarComponent } from './tipo-editar/tipo-editar.component';

const tipoRoutes = [
  { path: '', component: TipoPontoControleComponent},
  { path: 'cadastrar', component: TipoPontoControleCadastrarComponent},
  { path: 'editar/:id', component: TipoPontoControleEditarComponent},
];

@NgModule({
  imports: [RouterModule.forChild(tipoRoutes)], 
  exports: [RouterModule]
})

export class TipoPontoControleRoutingModule {}

import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {PlataformaCadastrarComponent} from './plataforma-cadastrar/plataforma-cadastrar.component';
import {PlataformaEditarComponent} from './plataforma-editar/plataforma-editar.component';
import {PlataformaComponent} from './plataforma.component';

const plataformaRoutes = [
  {path: '', component: PlataformaComponent},
  {path: 'cadastrar', component: PlataformaCadastrarComponent},
  {path: 'editar/:id', component: PlataformaEditarComponent},
];

@NgModule({
  imports: [RouterModule.forChild(plataformaRoutes)],
  exports: [RouterModule]
})

export class PlataformaRoutingModule {}

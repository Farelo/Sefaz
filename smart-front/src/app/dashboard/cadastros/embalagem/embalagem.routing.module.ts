import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {EmbalagemCadastroComponent} from './embalagem-cadastro/embalagem-cadastro.component';
import {EmbalagemEditarComponent} from './embalagem-editar/embalagem-editar.component';
import {EmbalagemComponent} from './embalagem.component';

const embalagemRoutes = [
  {path: '', component: EmbalagemComponent},
  {path: 'cadastrar', component: EmbalagemCadastroComponent},
  {path: 'editar/:id', component: EmbalagemEditarComponent},

];

@NgModule({
  imports: [RouterModule.forChild(embalagemRoutes)],
  exports: [RouterModule]
})

export class EmbalagemRoutingModule {}

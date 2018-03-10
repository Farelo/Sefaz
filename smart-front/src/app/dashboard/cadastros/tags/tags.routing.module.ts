import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {TagsCadastrarComponent} from './tags-cadastrar/tags-cadastrar.component';
import {TagsEditarComponent} from './tags-editar/tags-editar.component';
import {TagsComponent} from './tags.component';

const tagsRoutes = [
  {path: '', component: TagsComponent},
  {path: 'cadastrar', component: TagsCadastrarComponent},
  {path: 'editar/:id', component: TagsEditarComponent},
];

@NgModule({
  imports: [RouterModule.forChild(tagsRoutes)],
  exports: [RouterModule]
})

export class TagsRoutingModule {}

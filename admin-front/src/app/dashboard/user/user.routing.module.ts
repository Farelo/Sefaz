import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {UserAdicionarComponent} from './user-adicionar/user-adicionar.component';
import {UserEditarComponent} from './user-editar/user-editar.component';
import {UserComponent} from './user.component';

const userRoutes = [
  { path: '',   redirectTo: '/reciclapac', pathMatch: 'full' },
  {path: 'lista', component: UserComponent},
  {path: 'adicionar', component: UserAdicionarComponent},
  {path: 'editar/:id', component: UserEditarComponent}

];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})

export class UserRoutingModule {}

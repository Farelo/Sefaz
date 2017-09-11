import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {Gc16AdicionarComponent} from './gc16-adicionar/gc16-adicionar.component';
import {Gc16EditarComponent} from './gc16-editar/gc16-editar.component';
import {Gc16Component} from './gc16.component';

const gc16Routes = [
  {path: '', component: Gc16Component},
  {path: 'adicionar', component: Gc16AdicionarComponent},
  {path: 'editar/:id', component: Gc16EditarComponent}

  // {path: 'list/:hashing/:status', component: ListaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(gc16Routes)],
  exports: [RouterModule]
})

export class GC16RoutingModule {}

import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {PlantaCadastrarComponent} from './planta-cadastrar/planta-cadastrar.component';
import {PlantaEditarComponent} from './planta-editar/planta-editar.component';
import {PlantaComponent} from './planta.component';

const plantaRoutes = [
  {path: '', component: PlantaComponent},
  {path: 'cadastrar', component: PlantaCadastrarComponent},
  {path: 'editar/:id', component: PlantaEditarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(plantaRoutes)],
  exports: [RouterModule]
})

export class PlantaRoutingModule {}

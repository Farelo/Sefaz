import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { InventarioComponent } from './inventario.component';

const inventarioRoutes = [
  {path: '', component: InventarioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(inventarioRoutes)],
  exports: [RouterModule]
})

export class InventarioRoutingModule {}

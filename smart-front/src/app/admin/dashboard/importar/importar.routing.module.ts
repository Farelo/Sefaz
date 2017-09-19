import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ImportarComponent } from './importar.component';

const importartRoutes = [
  {path: '', component: ImportarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(importartRoutes)],
  exports: [RouterModule]
})

export class ImportarRoutingModule {}

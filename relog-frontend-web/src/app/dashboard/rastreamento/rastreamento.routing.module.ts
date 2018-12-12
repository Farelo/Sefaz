import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RastreamentoComponent } from './rastreamento.component';

const rastreamentoRoutes = [
  {path: '', component: RastreamentoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(rastreamentoRoutes)],
  exports: [RouterModule]
})

export class RastreamentoRoutingModule {}

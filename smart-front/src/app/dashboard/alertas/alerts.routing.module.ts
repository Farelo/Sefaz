import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListaComponent } from './lista/lista.component';
import { TimelineComponent } from './timeline/timeline.component';

const alertsRoutes = [
  {path: '', component: TimelineComponent},
  { path: ':family_id/:current_state', component: ListaComponent}
  // { path: 'list/:code/:project/:supplier/:status', component: ListaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(alertsRoutes)],
  exports: [RouterModule]
})

export class alertsRoutingModule {}

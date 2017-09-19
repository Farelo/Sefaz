import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListaComponent } from './lista/lista.component';
import { TimelineComponent } from './timeline/timeline.component';

const homeRoutes = [
  {path: '', component: TimelineComponent},
  {path: 'list/:hashing/:status', component: ListaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})

export class HomeRoutingModule {}

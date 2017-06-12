import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { DetalhesComponent } from './timeline/detalhes/detalhes.component';
import { ListaComponent } from './lista/lista.component';

const homeRoutes = [
  {path: 'home', component: HomeComponent, children: [
    {path: '', component: TimelineComponent},
    {path: ':hashing', component: ListaComponent}
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})

export class HomeRoutingModule {}

import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { TimelineComponent } from './timeline/timeline.component';
import { DetalhesComponent } from './timeline/detalhes/detalhes.component';
import { ListaComponent } from './lista/lista.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';

const homeRoutes = [
  {path: 'rc', component: DashboardComponent, children: [
    {path: '', redirectTo: '/rc/home', pathMatch: 'full'},
    {path: 'home', component: TimelineComponent, children: [
      //  {path: '', component: TimelineComponent},
       {path: ':hashing/:status', component: ListaComponent}
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})

export class HomeRoutingModule {}

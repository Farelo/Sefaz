import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { CadastrosComponent } from '../cadastros/cadastros.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { TimelineComponent } from './home//timeline/timeline.component';
import { ListaComponent } from './home/lista/lista.component';
import { DashboardComponent } from './dashboard.component';

const dashboardRoutes = [
  {path: 'rc', component: DashboardComponent, children: [
    {path: '', redirectTo: '/rc/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'cadastros', component: CadastrosComponent},
    // {path: '/cadastros', component: HomeComponent}
    // {path: ':hashing', component: ListaComponent}
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {}

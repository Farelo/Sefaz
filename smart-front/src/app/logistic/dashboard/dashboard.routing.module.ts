import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../guard/auth.guard';

const dashboardRoutes = [
  {path: 'logistico', component: DashboardComponent, canActivate: [AuthGuard], children: [
          {path: '', redirectTo: '/logistico/home', pathMatch: 'full'},
          {path: 'home', loadChildren: 'app/logistic/dashboard/home/home.module#HomeModule'},
          {path: 'inventario', loadChildren: 'app/logistic/dashboard/inventario/inventario.module#InventarioModule'},
          {path: 'rastreamento',  loadChildren: 'app/logistic/dashboard/rastreamento/rastreamento.module#RastreamentoModule'}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {}

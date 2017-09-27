import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../guard/auth.guard';

const dashboardRoutes = [
  {path: 'fornecedor', component: DashboardComponent, canActivate: [AuthGuard], children: [
          {path: '', redirectTo: '/fornecedor/home', pathMatch: 'full'},
          {path: 'home', loadChildren: 'app/supplier/dashboard/home/home.module#HomeModule'},
          {path: 'inventario', loadChildren: 'app/supplier/dashboard/inventario/inventario.module#InventarioModule'},
          {path: 'rastreamento',  loadChildren: 'app/supplier/dashboard/rastreamento/rastreamento.module#RastreamentoModule'}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {}

import { AlertsModule } from './alertas/alerts.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../guard/auth.guard';

const dashboardRoutes = [
  {path: 'rc', component: DashboardComponent, canActivate: [AuthGuard], children: [
          {path: 'home', loadChildren: 'app/dashboard/home/home.module#HomeModule'},
          {path: 'cadastros', loadChildren: 'app/dashboard/cadastros/cadastros.module#CadastrosModule'},
          {path: 'alertas', loadChildren: 'app/dashboard/alertas/alerts.module#AlertsModule'},
          {path: 'inventario', loadChildren: 'app/dashboard/inventario/inventario.module#InventarioModule'},
          {path: 'importar', loadChildren: 'app/dashboard/importar/importar.module#ImportarModule'},
          {path: 'rastreamento',  loadChildren: 'app/dashboard/rastreamento/rastreamento.module#RastreamentoModule'},
          {path: 'bpline', loadChildren: 'app/dashboard/gc16/gc16.module#GC16Module'},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {}

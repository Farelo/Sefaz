import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../guard/auth.guard';

const dashboardRoutes = [
  {path: 'rc', component: DashboardComponent, canActivate: [AuthGuard], children: [
          {path: '', redirectTo: '/rc/home', pathMatch: 'full'},
          {path: 'cadastros', loadChildren: 'app/admin/dashboard/cadastros/cadastros.module#CadastrosModule'},
          {path: 'home', loadChildren: 'app/admin/dashboard/home/home.module#HomeModule'},
          {path: 'inventario', loadChildren: 'app/admin/dashboard/inventario/inventario.module#InventarioModule'},
          {path: 'importar', loadChildren: 'app/admin/dashboard/importar/importar.module#ImportarModule'},
          {path: 'rastreamento',  loadChildren: 'app/admin/dashboard/rastreamento/rastreamento.module#RastreamentoModule'},
          {path: 'gc16', loadChildren: 'app/admin/dashboard/gc16/gc16.module#GC16Module'},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {}

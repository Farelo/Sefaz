import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../guard/auth.guard';

const dashboardRoutes = [
  {path: 'rc', component: DashboardComponent, canActivate: [AuthGuard], children: [
          {path: '', redirectTo: '/rc/home', pathMatch: 'full'},
          {path: 'home', loadChildren: 'app/admin/dashboard/user/user.module#UserModule'},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {}
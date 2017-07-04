import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const appRoutes: Routes = [


  { path: 'rc', component: DashboardComponent },
  // { path: 'rc', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' },
  { path: 'login', component: LoginComponent },
  { path: '', component: LandingPageComponent },
  { path: '**', redirectTo: ''},


];

@NgModule ({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}

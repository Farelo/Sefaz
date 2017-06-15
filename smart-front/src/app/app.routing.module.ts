import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const appRoutes: Routes = [

  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'rc', component: DashboardComponent }

];

@NgModule ({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const APP_ROUTES: Routes = [
  { path: 'rc', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: LandingPageComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);

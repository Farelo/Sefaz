import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportarComponent } from './importar/importar.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const APP_ROUTES: Routes = [
  { path: 'rc', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: LandingPageComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);

// { path: 'importar', component: ImportarComponent },
// { path: 'home', component: HomeComponent },
// { path: '', redirectTo: '/home' }

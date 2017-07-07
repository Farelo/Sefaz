import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EsqueciMinhaSenhaComponent } from './esqueci-minha-senha/esqueci-minha-senha.component'
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';

const APP_ROUTES: Routes = [
  { path: 'rc', component: DashboardComponent },
  { path: 'esqueciMinhaSenha', component: EsqueciMinhaSenhaComponent },
  { path: 'redefinirSenha', component: RedefinirSenhaComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: LandingPageComponent },
  { path: '**', redirectTo: ''},
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);

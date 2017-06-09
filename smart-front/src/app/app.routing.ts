import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportarComponent } from './importar/importar.component';
import { HomeComponent } from './home/home.component';


const APP_ROUTES: Routes = [
  { path: 'importar', component: ImportarComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);

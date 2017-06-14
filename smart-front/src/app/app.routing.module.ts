import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ImportarComponent } from './importar/importar.component';
import { InventarioComponent } from './inventario/inventario.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const appRoutes: Routes = [
  //{ path: 'home', component: HomeComponent },

  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'rc', component: DashboardComponent }

];

@NgModule ({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}

// { path: '', redirectTo: '/home', pathMatch: 'full' },
// { path: 'inventario', component: InventarioComponent },
// { path: 'importar', component: ImportarComponent }

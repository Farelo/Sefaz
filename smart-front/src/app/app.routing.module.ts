import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ImportarComponent } from './importar/importar.component';
import { InventarioComponent } from './inventario/inventario.component';

const appRoutes: Routes = [
  //{ path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'importar', component: ImportarComponent }
];

@NgModule ({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}

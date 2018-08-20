import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';

const homeRoutes = [
  { path: '', component: HomeComponent }

  // {path: 'list/:hashing/:status', component: ListaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})

export class HomeRoutingModule { }

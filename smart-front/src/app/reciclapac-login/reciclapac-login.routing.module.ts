import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReciclapacLoginComponent } from './reciclapac-login.component';

const reciclapacLoginRoutes = [
  {path: ':password/:email', component: ReciclapacLoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(reciclapacLoginRoutes)],
  exports: [RouterModule]
})

export class ReciclapacLoginRoutingModule {}

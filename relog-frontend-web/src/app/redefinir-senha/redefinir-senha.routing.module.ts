import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RedefinirSenhaComponent } from './redefinir-senha.component';

const redefinirsenhaRoutes = [
  {path: '', component: RedefinirSenhaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(redefinirsenhaRoutes)],
  exports: [RouterModule]
})

export class RedefinirSenhaRoutingModule {}

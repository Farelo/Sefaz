import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EsqueciMinhaSenhaComponent } from './esqueci-minha-senha.component';

const esqueciMinhaSenhaRoutes = [
  {path: '', component: EsqueciMinhaSenhaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(esqueciMinhaSenhaRoutes)],
  exports: [RouterModule]
})

export class EsqueciMinhaSenhaRoutingModule {}

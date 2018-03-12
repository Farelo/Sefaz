import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: 'esqueciMinhaSenha', loadChildren: 'app/esqueci-minha-senha/esqueci-minha-senha.module#EsqueciMinhaSenhaModule' },
  { path: 'redefinirSenha', loadChildren: 'app/redefinir-senha/redefinir-senha.module#RedefinirSenhaModule' },
  { path: 'login', loadChildren: 'app/login/login.module#LoginModule'},
  { path: 'reciclapac', loadChildren: 'app/landing-page/landing-page.module#LandingPageModule'},
  { path: '**', redirectTo: 'reciclapac' }

];

@NgModule ({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}

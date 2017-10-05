import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const appRoutes: Routes = [

  { path: 'esqueciMinhaSenha', loadChildren: 'app/esqueci-minha-senha/esqueci-minha-senha.module#EsqueciMinhaSenhaModule' },
  { path: 'redefinirSenha', loadChildren: 'app/redefinir-senha/redefinir-senha.module#RedefinirSenhaModule' },
  {path: 'login', loadChildren: 'app/login/login.module#LoginModule'},
  {path: 'reciclapaclogin', loadChildren: 'app/reciclapac-login/reciclapac-login.module#ReciclapacLoginModule'},
  { path: '', loadChildren: 'app/landing-page/landing-page.module#LandingPageModule'},
  { path: '**', redirectTo: ''},

];

@NgModule ({
    imports: [RouterModule.forRoot(appRoutes,{useHash: true})],
    exports: [RouterModule]
})

export class AppRoutingModule {}
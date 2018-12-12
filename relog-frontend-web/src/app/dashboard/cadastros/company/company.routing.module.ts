import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';  
import { CompanyCadastrarComponent } from './company-cadastrar/company-cadastrar.component'; 
import { CompanyEditarComponent } from './company-editar/company-editar.component';
import { CompanyComponent } from './company.component';

const companyRoutes = [
  { path: '', component: CompanyComponent },
  { path: 'cadastrar', component: CompanyCadastrarComponent },
  { path: 'editar/:id', component: CompanyEditarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(companyRoutes)],
  exports: [RouterModule]
})

export class CompanyRoutingModule {}

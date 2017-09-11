import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page.component';

const landingPageRoutes = [
  {path: '', component: LandingPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(landingPageRoutes)],
  exports: [RouterModule]
})

export class LandingPageRoutingModule {}

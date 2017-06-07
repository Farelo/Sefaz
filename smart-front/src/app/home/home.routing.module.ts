import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeInfoComponent } from './home-info/home-info.component';
import { HomeTimelineComponent } from './home-timeline/home-timeline.component';
import { ModalComponent } from '../shared/modal/modal.component';

const homeRoutes = [
  {path: 'home', component: HomeComponent//, children: [
    //{path: ':id', component: DetalheComponent}
  //]
}
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})

export class HomeRoutingModule {}

/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {LandingPageComponent} from './landing-page.component';
import {LandingPageRoutingModule} from './landing-page.routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [
    LandingPageRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AlertModule,
    ReactiveFormsModule
  ],
  declarations: [
    LandingPageComponent
  ],
  providers: [
  ],
})
export class LandingPageModule { }

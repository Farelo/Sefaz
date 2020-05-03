/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './login.component';
import {LoginRoutingModule} from './login.routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap';
import { ReactiveFormsModule} from '@angular/forms';
import { ToastyModule } from 'ng2-toasty';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    LoginRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AlertModule.forRoot(),
    ToastyModule.forRoot(),
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
  ],
})
export class LoginModule { }

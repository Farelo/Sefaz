/**
 * Created by david on 7/09/17.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {ImportarComponent} from './importar.component';
import {ImportarRoutingModule} from './importar.routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotTableModule } from 'ng2-handsontable';
import { ReactiveFormsModule} from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TranslateSettingsModule } from 'app/shared/translate/translateSettings.module';

@NgModule({
  imports: [
    ImportarRoutingModule,
    CommonModule,
    RouterModule,
      AlertModule,
    FormsModule,
    HotTableModule,
    ReactiveFormsModule,
    TranslateSettingsModule
  ],
  declarations: [
    ImportarComponent
  ],
  providers: [
  ],
})
export class ImportarModule { }

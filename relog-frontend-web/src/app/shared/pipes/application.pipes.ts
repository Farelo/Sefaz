import { NgModule } from '@angular/core';
import { TimePipe } from './time';
import { RoundPipe } from './round';
import { CompanyType } from './plantType'; 
import { TruncatePipe } from './truncate';
import { PackingStatus } from './packingStatus';
import { FloatTimePipe } from './floatTime'; 
import { StatusTime } from './statusTime';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    TimePipe,
    RoundPipe,
    CompanyType, 
    StatusTime,
    TruncatePipe,
    PackingStatus,
    FloatTimePipe,
  ],
  exports: [
    TimePipe,
    RoundPipe,
    CompanyType, 
    StatusTime,
    TruncatePipe,
    PackingStatus,
    FloatTimePipe,
  ]
})
export class ApplicationPipes {}

import { NgModule } from '@angular/core';
import { TimePipe } from './time';
import { RoundPipe } from './round';
import { CompanyType } from './plantType'; 
import { TruncatePipe } from './truncate';
import { RackStatus } from './rackStatus';
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
    RackStatus,
    FloatTimePipe,
  ],
  exports: [
    TimePipe,
    RoundPipe,
    CompanyType, 
    StatusTime,
    TruncatePipe,
    RackStatus,
    FloatTimePipe,
  ]
})
export class ApplicationPipes {}

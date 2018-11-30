import { NgModule } from '@angular/core';
import { TimePipe } from './time';
import { RoundPipe } from './round';
import { CompanyType } from './plantType'; 
import { TruncatePipe } from './truncate';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    TimePipe,
    RoundPipe,
    CompanyType, 
    TruncatePipe
  ],
  exports: [
    TimePipe,
    RoundPipe,
    CompanyType, 
    TruncatePipe
  ]
})
export class ApplicationPipes {}

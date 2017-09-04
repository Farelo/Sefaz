import { NgModule } from '@angular/core';
import { TimePipe } from './time';
import { RoundPipe } from './round';
@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    TimePipe,
    RoundPipe
  ],
  exports: [
    TimePipe,
    RoundPipe
  ]
})
export class ApplicationPipes {}

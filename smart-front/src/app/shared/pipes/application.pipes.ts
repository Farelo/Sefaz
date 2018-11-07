import { NgModule } from '@angular/core';
import { TimePipe } from './time';
import { RoundPipe } from './round';
import { PlantType } from './plantType'; 
import { TruncatePipe } from './truncate';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    TimePipe,
    RoundPipe,
    PlantType, 
    TruncatePipe
  ],
  exports: [
    TimePipe,
    RoundPipe,
    PlantType, 
    TruncatePipe
  ]
})
export class ApplicationPipes {}

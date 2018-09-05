import { NgModule } from '@angular/core';
import { TimePipe } from './time';
import { RoundPipe } from './round';
import { PlantType } from './plantType'; 

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    TimePipe,
    RoundPipe,
    PlantType, 
  ],
  exports: [
    TimePipe,
    RoundPipe,
    PlantType, 
  ]
})
export class ApplicationPipes {}

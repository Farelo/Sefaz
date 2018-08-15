import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'round'})
export class RoundPipe {
  transform (input:number) {
    if(input ==undefined) return '-';
    return Math.floor(input);
  }
}

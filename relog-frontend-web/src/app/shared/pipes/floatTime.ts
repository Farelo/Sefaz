import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'float_time'})
export class FloatTimePipe {

  transform (value: number) {

    let time = value;
    let seconds = time * 3600;  // get total amount of seconds from your input

    let days = Math.floor(seconds / (3600 * 24));

    seconds -= days * 3600 * 24;
    let hours   = Math.floor(seconds / 3600);

    seconds -= hours * 3600;
    let minutes = Math.floor(seconds / 60);

    seconds -= minutes * 60;


    let labelDays = (days > 0) ? (" dias ") : ( " dia ");
    let labelHours = (hours > 0) ? (" horas ") : (" hora ");
    let labelMinutes = (minutes > 0) ? (" minutos ") : (" minuto ");
    let labelSeconds = (seconds > 0) ? (" segundos ") : (" segundo ");
   
    if (days != 0)
      return `${days + labelDays + hours + labelHours + minutes + labelMinutes}`;
    else
      return `${hours + labelHours + minutes + labelMinutes}`;
  }
}

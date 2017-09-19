import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'time'})
export class TimePipe {
  transform (value:number) {
    let time = value;
    parseInt((time / 1000).toString())
    let seconds: string | number = (parseInt((time / 1000).toString()) % 60);
    let minutes: string | number = (parseInt((time / (1000 * 60)).toString()) % 60);
    let hours: string | number = (parseInt((time / (1000 * 60 * 60)).toString()) % 24);
    let days: string | number = (parseInt((time / (1000 * 60 * 60 * 24)).toString()));

    days = (days < 10) ? "0" + days : days;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if(days != 0){
      return  days + " Dia";
    }else{
      return  hours + " Horas e " + minutes + " Minutos"  ;
    }

  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = '...') {
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }

    if(limit < value.length)
      return `${value.substr(0, limit)}${ellipsis}`;
    else
      return `${value.substr(0, limit)}`;
  }
}

//https://stackoverflow.com/questions/44669340/how-to-truncate-text-in-angular2
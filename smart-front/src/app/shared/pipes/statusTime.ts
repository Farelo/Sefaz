import { Packing } from './../models/packing';
import { Pipe, PipeTransform } from '@angular/core';
import { constants } from '../../../environments/constants';

@Pipe({ name: 'statusTime' })
export class StatusTime {
  transform(packing: Packing) {
    switch (packing.status) {
      case constants.STATUS_TIME.MISSING:
        return packing.packing_missing.time_countdown;

      case constants.STATUS_TIME.PERMANENCE_EXCEEDED:
        return packing.permanence.amount_days;

      case constants.STATUS_TIME.TRAVELING:
        return packing.trip.time_countdown;

      case constants.STATUS_TIME.LATE:
        return packing.trip.time_late;

      case constants.STATUS_TIME.INCORRECT_LOCAL:
        return packing.permanence.amount_days;

      case constants.STATUS_TIME.INCONTIDA:
        return packing.incontida.time;
    }
    return '';
  }
}

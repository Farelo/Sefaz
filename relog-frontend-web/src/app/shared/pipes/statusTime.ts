import { Rack } from './../models/rack';
import { Pipe, PipeTransform } from '@angular/core';
import { constants } from '../../../environments/constants';

@Pipe({ name: 'statusTime' })
export class StatusTime {
  transform(rack: Rack) {
    switch (rack.status) {
      case constants.STATUS_TIME.MISSING:
        return rack.rack_missing.time_countdown;

      case constants.STATUS_TIME.PERMANENCE_EXCEEDED:
        return rack.permanence.amount_days;

      case constants.STATUS_TIME.TRAVELING:
        return rack.trip.time_countdown;

      case constants.STATUS_TIME.LATE:
        return rack.trip.time_late;

      case constants.STATUS_TIME.INCORRECT_LOCAL:
        return rack.permanence.amount_days;

      case constants.STATUS_TIME.INCONTIDA:
        return rack.incontida.time;
    }
    return '';
  }
}

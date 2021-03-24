import { Packing } from './../models/packing';
import { Pipe, PipeTransform } from '@angular/core';
import { constants } from '../../../environments/constants';

@Pipe({ name: 'packingStatus' })
export class PackingStatus {

  transform(status: string) {

    console.log(status);

    switch (status) {

      case 'desabilitada_com_sinal':
        return constants.DISABLED_SIGNAL;

      case 'desabilitada_sem_sinal':
        return constants.DISABLED_NO_SIGNAL;

      case 'analise':
        return constants.ANALISYS;

      case 'viagem_em_prazo':
        return constants.TRAVELING;

      case 'viagem_atrasada':
        return constants.LATE;

      case 'viagem_perdida':
        return constants.TRAVEL_LOST;

      case 'sem_sinal':
        return constants.NO_SIGNAL;

      case 'perdida':
        return constants.LOST;

      case 'local_correto':
        return constants.CORRECT_LOCAL;

      case 'local_incorreto':
        return constants.INCORRECT_LOCAL;

      case 'missing':
        return constants.MISSING;

      case 'normal':
        return constants.NORMAL;

      case 'permanence_time':
        return constants.PERMANENCE_EXCEEDED;  
    }

    return '';
  }
}

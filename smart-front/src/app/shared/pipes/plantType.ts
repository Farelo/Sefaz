import { Pipe, PipeTransform } from '@angular/core';
import { Packing } from '../models/packing';
import { constants } from '../../../environments/constants';

@Pipe({name: 'type'})
export class CompanyType {

  transform(actual_company: any) {
    
    //console.log('actual_company:' + JSON.stringify(actual_company));
    
    if (actual_company) {
      if (String(actual_company) === 'owner') return constants.PLANT_TYPE.FACTORY;
      if (String(actual_company) === 'client') return constants.PLANT_TYPE.SUPPLIER;

    } else {
      return '-';
    }
  }
}
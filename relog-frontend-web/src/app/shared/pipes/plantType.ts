import { Pipe, PipeTransform } from '@angular/core';
import { Packing } from '../models/packing';
import { constants } from '../../../environments/constants';

@Pipe({name: 'type'})
export class CompanyType {

  transform(actual_company: any) {
    
    //console.log('actual_company:' + JSON.stringify(actual_company));
    switch(actual_company){

      case 'owner':
        return constants.PLANT_TYPE.OWNER;  
      
      case 'client':
        return constants.PLANT_TYPE.CLIENT; 

      default:
        return '-';
    }
  }
}
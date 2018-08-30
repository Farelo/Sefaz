import { Pipe, PipeTransform } from '@angular/core';
import { Packing } from '../models/packing';
import { constants } from '../../../environments/constants';

@Pipe({name: 'type'})
export class PlantType {
  transform(actual_plant: any) {
    
    //console.log('actual_plant:' + JSON.stringify(actual_plant));
    
    if (actual_plant){
      if (actual_plant.local) {
        if (String(actual_plant.local) === 'Factory') return constants.PLANT_TYPE.FACTORY;

        if (String(actual_plant.local) === 'Supplier') return constants.PLANT_TYPE.SUPPLIER;

        if (String(actual_plant.local) === 'Logistic') return constants.PLANT_TYPE.LOGISTIC;

      } else {
        return '-';
      }
    } else {
      return '-';
    }
    
  }
}
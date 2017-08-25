import { Supplier } from '../models/supplier';
import { Plant } from '../models/plant';

export class Route {
  public supplier: string;
  public plant_factory: string;
  public plant_supplier: string;
  public packing_code: string;
  public hashPacking: string;
  public location : {
    distance: {
      text: string,
      value: number
    },
    duration: {
      text: string,
      value: number
    },
    start_address: string,
    end_address: string
  };
  public _id: string;


    public constructor(fields ?: {
  supplier?: string,
  plant_factory?: string,
  plant_supplier?: string,
  packing_code?: string,
  hashPacking?: string,
  location? : {
    distance?: {
      text?: string,
      value?: number
    },
    duration?: {
      text?: string,
      value?: number
    },
    start_address?: string,
    end_address?: string
  },
  _id?: string
}
){

  if (fields) Object.assign(this, fields);

}


}

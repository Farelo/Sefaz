import { Supplier } from '../models/supplier';
import { Plant } from '../models/plant';

export class Route {
  public supplier: string;
  public plant_factory: string;
  public plant_supplier: string;
  public packing_code: string;
  public estimeted_time: number;
  public date_estimated: any;
  public hashPacking: string;
  public _id: string;


    public constructor(fields ?: {
  supplier?: string,
  plant_factory?: string,
  plant_supplier?: string,
  packing_code?: string,
  estimeted_time?: number,
  date_estimated?: any,
  hashPacking?: string,
  _id?: string
}
){

  if (fields) Object.assign(this, fields);

}


}

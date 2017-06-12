export class Route {
  public supplier: string;
  public plant_factory: string;
  public plant_supplier: string;
  public packing_code: string;
  public estimeted_time: string;
  public date_estimated: string;
  public hashPacking: string;
  public _id: string;


    public constructor(fields ?: {
  supplier?: string,
  plant_factory?: string,
  plant_supplier?: string,
  packing_code?: string,
  estimeted_time?: string,
  date_estimated?: string,
  hashPacking?: string,
  _id?: string
}
){

  if (fields) Object.assign(this, fields);

}


}

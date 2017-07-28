export class Packing {
  public code: string;
  public type: string;
  public weigth: number;
  public width: number;
  public heigth: number;
  public length: number;
  public capacity: number;
  public status: string;
  public problem: boolean;
  public missing: boolean;
  public permanence_exceeded: boolean;
  public last_time: string;
  public amount_days: number;
  public last_time_missing: string;
  public time_countdown: number;
  public correct_plant_factory: string;
  public correct_plant_supplier: string;
  public actual_plant: string;
  public tag_mac: string;
  public department: string;
  public supplier: any;
  public project: any;
  public hashPacking : string;
  public serial : string;
  public gc16 : string;
  public _id : string;

    public constructor(fields ?: {
      code?: string;
      type?: string;
      weigth?: number;
      width?: number;
      heigth?: number;
      length?: number;
      capacity?: number;
      status?: string;
      problem?: boolean;
      missing?: boolean;
      permanence_exceeded?: boolean;
      last_time?: string;
      amount_days?: number;
      last_time_missing?: string;
      time_countdown?: number;
      correct_plant_factory?: string;
      correct_plant_supplier?: string;
      actual_plant?: string;
      tag_mac?: string;
      department?: string;
      supplier?: any;
      project?: any;
      hashPacking ?: string;
      serial ?: string;
      gc16 ?: string;
      _id ?: string;
}
){

  if (fields) Object.assign(this, fields);

}


}

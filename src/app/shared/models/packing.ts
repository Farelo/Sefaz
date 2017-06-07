export class Packing {
    constructor(
      public code: string,
      public type: string,
      public weigth: number,
      public width: number,
      public heigth: number,
      public length: number,
      public capacity: number,
      public status: string,
      public problem: boolean,
      public missing: boolean,
      public permanence_exceeded: boolean,
      public last_time: string,
      public amount_days: number,
      public last_time_missing: string,
      public time_countdown: number,
      public correct_plant_factory: string,
      public correct_plant_supplier: string,
      public actual_plant: string,
      public tag_mac: string,
      public department: string,
      public supplier: string,
      public project: string,
      public hashPacking : string,
      public _id : string
        ){}
}

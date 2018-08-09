export class Packing {
  code: string;
  type: string;
  weigth: number;
  width: number;
  heigth: number;
  length: number;
  capacity: number;
  status: string;
  battery: number;
  problem: boolean;
  missing: boolean;
  lastCommunication: number;
  permanence: {
    time_exceeded: boolean;
    date: number;
    amount_days: number;
  };
  trip: {
    time_exceeded: boolean;
    date: number;
    time_countdown: number;
    time_late: number;
    date_late: number;
  };
  packing_missing: {
    last_time: number;
    time_countdown: number;
  };
  position: {
    latitude: number;
    longitude: number;
    accuracy: number;
    date: number;
  };
  temperature: number;
  serial: string;
  correct_plant_factory: string;
  gc16: string;
  route: string;
  correct_plant_supplier: string;
  actual_plant: any;
  tag: string;
  code_tag: string;
  department: string;
  supplier: string;
  project: string;
  hashPacking: string;
  incontida: {
    date: number;
    time: number;
    isIncotida: boolean;
  };
}

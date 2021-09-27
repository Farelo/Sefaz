
export interface Route {
   supplier: string;
   plant_factory: string;
   plant_supplier: string;
   rack_code: string;
   hashRack: string;
   time: {
     max: number,
     min: number
   };
   location : {
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
   _id: string;


}

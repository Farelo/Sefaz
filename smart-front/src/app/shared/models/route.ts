
export interface Route {
   supplier: string;
   plant_factory: string;
   plant_supplier: string;
   packing_code: string;
   hashPacking: string;
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

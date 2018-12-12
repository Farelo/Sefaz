export interface GC16 {
   annualVolume: number;
   capacity: number;
   productiveDays: number;
   containerDays: number;
   project: any;
   packing: string;
   supplier: any;
   _id : string;
   factoryStock: {
    fsDays: number,
    fs:  number,
    fsMax:  number,
    QuantContainerfs:  number,
    QuantContainerfsMax:  number
  };
   supplierStock: {
    ssDays:  number,
    ss:  number,
    ssMax:  number,
    QuantContainerSs:  number,
    QuantContainerSsMax:  number
  };
   transportationGoing: {
    tgDays:  number,
    tg:  number,
    QuantContainerTg:  number
  };
   transportantionBack: {
    tbDays:  number,
    tb:  number,
    QuantContainerTb:  number
  };
   frequency: {
    fDays:  number,
    fr:  number,
    QuantTotalDays:  number,
    QuantContainer:  number
  };
   secutiryFactor: {
    percentage:  number,
    QuantTotalBuilt:  number,
    QuantContainer:  number
  };
}

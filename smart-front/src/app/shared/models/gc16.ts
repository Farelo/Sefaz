export class GC16 {
  public annualVolume: number;
  public capacity: number;
  public productiveDays: number;
  public containerDays: number;
  public project: any;
  public packing: string;
  public supplier: any;
  public _id : string;
  public factoryStock: {
    days: number,
    fs:  number,
    fsMax:  number,
    QuantContainerfs:  number,
    QuantContainerfsMax:  number
  };
  public supplierStock: {
    days:  number,
    ss:  number,
    ssMax:  number,
    QuantContainerSs:  number,
    QuantContainerSsMax:  number
  };
  public transportationGoing: {
    days:  number,
    tg:  number,
    QuantContainerTg:  number
  };
  public transportantionBack: {
    days:  number,
    tb:  number,
    QuantContainerTb:  number
  };
  public frequency: {
    days:  number,
    fr:  number,
    QuantTotalDays:  number,
    QuantContainer:  number
  };
  public secutiryFactor: {
    percentage:  number,
    QuantTotalBuilt:  number,
    QuantContainer:  number
  };

    public constructor(fields ?: {
      annualVolume ?: number;
      capacity ?: number;
      productiveDays ?: number;
      factoryStock?: any ;
      supplierStock?: any ;
      transportationGoing?: any ;
      transportantionBack?: any ;
      frequency?: any ;
      secutiryFactor?: any ;
      project?: any;
      packing?: string;
      supplier?: any;
}
){

  if (fields) Object.assign(this, fields);

}


}

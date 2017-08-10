export class Plant {
    public name: string;
    public _id: string;
    public lat: number;
    public lng: number;
    public logistic_operator: string;
    public supplier: string;

    public constructor(fields ?: {
  name?: string,
  _id?: string,
  logistic_operator?: string,
  supplier?: string,
  lat?: number,
  lng?: number
}
){

  if (fields) Object.assign(this, fields);

}


}

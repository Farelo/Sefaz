export class Plant {
    public name: string;
    public _id: string;
    public lat: number;
    public lng: number;

    public constructor(fields ?: {
  name?: string,
  _id?: string,
  lat?: number,
  lng?: number
}
){

  if (fields) Object.assign(this, fields);

}


}

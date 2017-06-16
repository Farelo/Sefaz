
export class Department {
    public name: string;
    public plant: any;
    public _id: string;

    public constructor(fields ?: {
  name?: string,
  plant?: any,
  _id?: string
}
){

  if (fields) Object.assign(this, fields);

}


}

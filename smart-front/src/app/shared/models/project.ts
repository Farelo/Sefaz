export class Project {
    public name: string;
    public _id: string;

    public constructor(fields ?: {
  name?: string,
  _id?: string
}
){

  if (fields) Object.assign(this, fields);

}


}

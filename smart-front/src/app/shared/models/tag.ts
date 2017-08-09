export class Tag {
    public code: string;
    public _id: string;

    public constructor(fields ?: {
  code?: string,
  _id?: string
}
){

  if (fields) Object.assign(this, fields);

}


}

export class Tag {
    public code: string;
    public mac: string;
    public status: string;
    public friendly_name: string;
    public _id: string;

    public constructor(fields ?: {
  code?: string,
  mac?: string,
  status?: string,
  friendly_name?: string,
  _id?: string
}
){

  if (fields) Object.assign(this, fields);

}


}

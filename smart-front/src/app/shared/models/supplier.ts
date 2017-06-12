export class Supplier {
    public name: string;
    public duns: string;
    public cnpj: string;
    public profile: string;
    public plant: string;
    public _id: string;

    public constructor(fields ?: {
  name?: string,
  duns?: string,
  cnpj?: string,
  profile?: string,
  plant?: string,
  _id?: string
}
){

  if (fields) Object.assign(this, fields);

}


}

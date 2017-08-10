export class Profile {
    public profile: number;
    public _id: string;
    public password: string;
    public email: string;
    public address: string;
    public city: string;
    public telephone: string;
    public cellphone: string;
    public neighborhood: string;
    public uf: string;
    public cep: string;

    public constructor(fields ?: {
        profile?: number,
        _id?: string,
        password?: string,
        email?: string,
        address?: string,
        city?: string,
        telephone?: string,
        cellphone?: string,
        neighborhood?: string,
        uf?: string,
        cep?: string
    }
    ){

  if (fields) Object.assign(this, fields);

  }

}

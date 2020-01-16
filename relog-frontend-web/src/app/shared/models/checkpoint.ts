export class Checkpoint {
  public code: string;
  public place_id: string;
  public department: string;
  public plant: string;
  public _id: string;

  public constructor(fields?: {
    code?: string,
    place_id?: string,
    department?: string,
    plant?: string,
    _id?: string
  }) {

    if (fields) Object.assign(this, fields);
  }
}

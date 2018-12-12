export class Pagination {
  public data: any[];
  public meta: {page: number};

  public constructor(fields?: {
    data?: any[],
    meta?: {}
  }
  ) {

    if (fields) Object.assign(this, fields);

  }

}

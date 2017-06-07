import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Plant } from '../shared/models/plant';

@Injectable()
export class PlantsService {

  constructor(private http: Http) { }
  private url = 'http://localhost:8080/api/';


  getPlantsPagination(limit: number, page: number): Observable<Plant[]> {
    return this.http.get(this.url + 'plant/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().plants)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<Plant[]> {
    return this.http.get(this.url + 'plant/list/all')
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrievePlant(id: string): Observable<Plant>{
    return this.http.get(this.url + 'plant/retrieve/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updatePlant(id: string, tag: Plant): Observable<Plant>{
    return this.http.put(this.url + 'plant/update' + id,tag)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deletePlant(id: string): Observable<Plant>{
    return this.http.delete(this.url + 'plant/delete' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createPlant(tag: Plant): Observable<Plant>{
    return this.http.post(this.url + 'plant/create', tag)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

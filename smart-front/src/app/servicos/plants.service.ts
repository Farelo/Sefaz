import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Plant } from '../shared/models/plant';
import { environment } from '../../environments/environment';

@Injectable()
export class PlantsService {

  constructor(private http: Http) { }

  getPlantsPagination(limit: number, page: number): Observable<Plant[]> {
    return this.http.get(environment.url + 'plant/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().plants)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<Plant[]> {
    return this.http.get(environment.url + 'plant/list/all')
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrievePlant(id: string): Observable<Plant>{
    return this.http.get(environment.url + 'plant/retrieve/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updatePlant(id: string, plant: Plant): Observable<Plant>{
    return this.http.put(environment.url + 'plant/update/' + id,plant)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deletePlant(id: string): Observable<Plant>{
    return this.http.delete(environment.url + 'plant/delete/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createPlant(plant: Plant): Observable<Plant>{
    return this.http.post(environment.url + 'plant/create', plant)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

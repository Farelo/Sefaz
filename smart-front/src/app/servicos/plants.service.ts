import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Plant } from '../shared/models/plant';
import { environment } from '../../environments/environment';

@Injectable()
export class PlantsService {

  constructor(private http: Http) { }

  getPlantsPagination(limit: number, page: number, attr:any): Observable<any> {
    return this.http.get(environment.url + 'plant/list/pagination/' + limit + '/' + page+ '?attr='+ attr)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<any> {
    return this.http.get(environment.url + 'plant/list/all')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAllNoBinded(code: string, supplier: string): Observable<any> {
    return this.http.get(environment.url + 'plant/list/nobinded/'+code+"/"+supplier)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveGeneral(): Observable<any> {
    return this.http.get(environment.url + 'plant/list/general')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrievePlant(id: string): Observable<any>{
    return this.http.get(environment.url + 'plant/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updatePlant(id: string, plant: any): Observable<any>{
    return this.http.put(environment.url + 'plant/update/' + id,plant)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deletePlant(id: string): Observable<any>{
    return this.http.delete(environment.url + 'plant/delete/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createPlant(plant: Plant): Observable<any>{
    return this.http.post(environment.url + 'plant/create', plant)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createPlantArray(array: any): Observable<any>{
    return this.http.post(environment.url + 'plant/create/array', array)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

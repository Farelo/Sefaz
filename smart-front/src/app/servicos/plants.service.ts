import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Plant } from '../shared/models/plant';
import { environment } from '../../environments/environment';

@Injectable()
export class PlantsService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getPlantsPagination(limit: number, page: number, attr:any): Observable<any> {
    return this.http.get(`${environment.url}plant/list/pagination/${limit}/${page}?attr=${attr}`)
      .catch(this.handleError);
  }

  retrieveAll(): Observable<any> {
    return this.http.get(`${environment.url}plant/list/all`)
      .catch(this.handleError);
  }

  retrieveAllNoBinded(code: string, supplier: string, project: string): Observable<any> {
    return this.http.get(`${environment.url}plant/list/nobinded/${code}/${supplier}/${project}`)
      .catch(this.handleError);
  }

  retrieveGeneral(attr: string = ''): Observable<any> {
    return this.http.get(`${environment.url}plant/list/general?attr=${attr}`)
      .catch(this.handleError);
  }

  retrieveGeneralLogistic(array: any): Observable<any> {
    return this.http.post(`${environment.url}plant/list/general/logistic`,array)
      .catch(this.handleError);
  }

  retrievePlant(id: string): Observable<any>{
    return this.http.get(`${environment.url}plant/retrieve/${id}`)
      .catch(this.handleError);
  }

  retrievePlantByName(name: string): Observable<any>{
    return this.http.get(`${environment.url}plant/retrieve/name/${name}`)
      .catch(this.handleError);
  }

  updatePlant(id: string, plant: any): Observable<any>{
    return this.http.put(`${environment.url}plant/update/${id}`,plant)
      .catch(this.handleError);
  }

  deletePlant(id: string): Observable<any>{
    return this.http.delete(`${environment.url}plant/delete/${id}`)
      .catch(this.handleError);
  }

  createPlant(plant: Plant): Observable<any>{
    return this.http.post(`${environment.url}plant/create`, plant)
      .catch(this.handleError);
  }

  createPlantArray(array: any): Observable<any>{
    return this.http.post(`${environment.url}plant/create/array`, array)
      .catch(this.handleError);
  }

}

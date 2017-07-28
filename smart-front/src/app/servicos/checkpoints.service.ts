import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Checkpoint } from '../shared/models/checkpoint';
import { environment } from '../../environments/environment';

@Injectable()
export class CheckpointService {

  constructor(private http: Http) { }

  getCheckpointsPagination(limit: number, page: number): Observable<any> {
    return this.http.get(environment.url + 'checkpoint/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<any> {
    return this.http.get(environment.url + 'checkpoint/list/all/nobinded/')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveCheckpoint(id: string): Observable<any>{
    return this.http.get(environment.url + 'checkpoint/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateCheckpoint(id: string, checkpoint: Checkpoint): Observable<any>{
    return this.http.put(environment.url + 'checkpoint/update/' + id,checkpoint)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteCheckpoint(id: string): Observable<any>{
    return this.http.delete(environment.url + 'checkpoint/delete/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createCheckpoint(checkpoint: Checkpoint[]): Observable<any>{
    return this.http.post(environment.url + 'checkpoint/create', checkpoint)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

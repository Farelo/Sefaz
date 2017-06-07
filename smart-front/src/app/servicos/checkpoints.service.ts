import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Checkpoint } from '../shared/models/checkpoint';

@Injectable()
export class CheckpointService {

  constructor(private http: Http) { }
  private url = 'http://localhost:8080/api/';


  getCheckpointsPagination(limit: number, page: number): Observable<Checkpoint[]> {
    return this.http.get(this.url + 'checkpoint/list/pagination/' + limit + '/' + page)
      .map((res: Response) => res.json().checkpoints)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<Checkpoint[]> {
    return this.http.get(this.url + 'checkpoint/list/all/nobinded/')
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveCheckpoint(id: string): Observable<Checkpoint>{
    return this.http.get(this.url + 'checkpoint/retrieve/' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateCheckpoint(id: string, tag: Checkpoint): Observable<Checkpoint>{
    return this.http.put(this.url + 'checkpoint/update' + id,tag)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteCheckpoint(id: string): Observable<Checkpoint>{
    return this.http.delete(this.url + 'checkpoint/delete' + id)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createCheckpoint(tag: Checkpoint): Observable<Checkpoint>{
    return this.http.post(this.url + 'checkpoint/create', tag)
      .map((res: Response) => res.json().data)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

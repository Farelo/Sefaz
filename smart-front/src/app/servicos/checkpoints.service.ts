import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Checkpoint } from '../shared/models/checkpoint';
import { environment } from '../../environments/environment';

@Injectable()
export class CheckpointService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  getCheckpointsPagination(limit: number, page: number): Observable<any> {
    return this.http.get(environment.url + 'checkpoint/list/pagination/' + limit + '/' + page)
      .catch(this.handleError);
  }

  retrieveAll(): Observable<any> {
    return this.http.get(environment.url + 'checkpoint/list/all/nobinded/')
      .catch(this.handleError);
  }

  retrieveCheckpoint(id: string): Observable<any>{
    return this.http.get(environment.url + 'checkpoint/retrieve/' + id)
      .catch(this.handleError);
  }

  updateCheckpoint(id: string, checkpoint: Checkpoint): Observable<any>{
    return this.http.put(environment.url + 'checkpoint/update/' + id,checkpoint)
      .catch(this.handleError);
  }

  deleteCheckpoint(id: string): Observable<any>{
    return this.http.delete(environment.url + 'checkpoint/delete/' + id)
      .catch(this.handleError);
  }

  createCheckpoint(checkpoint: Checkpoint[]): Observable<any>{
    return this.http.post(environment.url + 'checkpoint/create', checkpoint)
      .catch(this.handleError);
  }

}

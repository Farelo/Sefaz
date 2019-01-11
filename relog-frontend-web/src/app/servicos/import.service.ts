import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class ImportService {

  constructor(private http: HttpClient) { }

  private handleError(error: Response) {
      return Observable.throw(error);
  }

  sendDataToImportControlPoint(file: any): Observable<any> {
    // return this.http.post(`${environment.url}upload/plant`, file)
    //   .catch(this.handleError);
    let result = {
      errors: [
        {
          line: 1,
          description: "Erro por motivo x"
        },
        {
          line: 2,
          description: "Erro por motivo y"
        }
      ],
      updated: [
        {
          line: 3,
          data: {
            geofence_type: "C",
            coordinates: "(11.222, 23.444)",
            radius: 250,
            name: "Nome 1",
            full_address: "Endereço 1",
            type: "Fábrica",
            company: "Transporte Nogueira",
            duns: "11223344",
          }
        },
        {
          line: 4,
          data: {
            geofence_type: "C",
            coordinates: "(11.222, 23.444)",
            radius: 250,
            name: "Nome 2",
            full_address: "Endereço 2",
            type: "Fábrica",
            company: "Transporte Lima",
            duns: "22003",
          }
        }
      ],
      to_register: [
        {
          line: 5,
          data: {
            geofence_type: "C",
            coordinates: "(11.222, 23.444)",
            radius: 250,
            name: "Nome 3",
            full_address: "Endereço 3",
            type: "Fábrica",
            company: "Transporte Rapidex",
            duns: "4488",
          }
        }
      ]
    }

    return Observable.of(result);
  }

  sendDataToImportPacking(file: any): Observable<any> {
    // return this.http.post(`${environment.url}upload/packing`, file)
    //   .catch(this.handleError);

// <th>family</th>
// <th>serial</th>
// <th></th>
// <th></th>
// <th></th>
// <th></th>
// <th></th>
// <th></th>
// <th></th>
// <th></th>
// <th></th>
// <th></th>
// <th></th>

    let result = {
      errors: [
        {
          line: 1,
          description: "Erro por motivo x"
        },
        {
          line: 2,
          description: "Erro por motivo y"
        }
      ],
      updated: [
        {
          line: 3,
          data: {
            family: "C",
            serial: 250,
            tag: "Nome 1",
            version: "Endereço 1",
            manufactorer: "Alumynium",
            weigth: "1.0",
            width: "1.2",
            height: "1.3",
            length: "1.6",
            capacity: "12",
            observations: "NENHUMA",
            type: "Rack metálico",
            projec: "Fase 2",
          }
        },
        {
          line: 4,
          data: {
            family: "C", 
            serial: 250,
            tag: "Nome 2",
            version: "Endereço 2",
            manufactorer: "Acme Racks",
            weigth: "1.0",
            width: "1.2",
            height: "1.3",
            length: "1.6",
            capacity: "12",
            observations: "NENHUMA",
            type: "Rack metálico",
            projec: "Fase 2",
          }
        }
      ],
      to_register: [
        {
          line: 5,
          data: {
            geofence_type: "C",
            coordinates: "(11.222, 23.444)",
            radius: 250,
            name: "Nome 3",
            full_address: "Endereço 3",
            type: "Fábrica",
            company: "Transporte Rapidex",
            duns: "4488",
          }
        }
      ]
    }

    return Observable.of(result);
    
  }

  sendDataToImportRoute(file: any): Observable<any> {
    return this.http.post(`${environment.url}upload/route`, file)
      .catch(this.handleError);
  }

}

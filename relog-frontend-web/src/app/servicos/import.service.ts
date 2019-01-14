import { Injectable } from '@angular/core';
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
    // return this.http.post(`${environment.url}/imports/packing_xlsx`, file)
    //   .catch(this.handleError);

    let result = {
      "errors": [
        {
          "line": 3,
          "description": "Family code Ljadasd do not exists"
        }
      ],
      "updated": [
        {
          "line": 2,
          "data": {
            "tag": {
              "code": "4083565",
              "version": "1.0",
              "manufactorer": "Sigfox"
            },
            "weigth": 1400,
            "width": 6.87,
            "heigth": 0,
            "length": 3.04,
            "capacity": 24,
            "temperature": 0,
            "active": true,
            "absent": true,
            "absent_time": null,
            "low_battery": false,
            "permanence_time_exceeded": false,
            "current_state": "analise",
            "_id": "5c17c512ebad931c8c6d735e",
            "family": {
              name: "LTR6"
            },
            "serial": "325",
            "created_at": "2018-12-17T15:47:30.609Z",
            "update_at": "2019-01-11T19:08:28.567Z",
            "__v": 0,
            "last_device_data": "5c35cc92a42acb0024fade6d",
            "last_current_state_history": "5c35ccb421eeb7002fdefcba",
            "last_device_data_battery": "5c332c26a42acb0024faca9e",
            "project": {
              name: "Fase 2"
            },
            "type": null,
            "observations": null
          }
        },
        {
          "line": 4,
          "data": {
            "tag": {
              "code": "4082288",
              "version": "1.0",
              "manufactorer": "Sigfox"
            },
            "weigth": 1100,
            "width": 3.525,
            "heigth": 0,
            "length": 3.04,
            "capacity": 24,
            "temperature": 0,
            "active": true,
            "absent": true,
            "absent_time": null,
            "low_battery": false,
            "permanence_time_exceeded": false,
            "current_state": "local_correto",
            "_id": "5c17c512ebad931c8c6d7382",
            "family": {
              name: "LTR6"
            },
            "serial": "526",
            "created_at": "2018-12-17T15:47:30.620Z",
            "update_at": "2019-01-11T19:08:28.591Z",
            "__v": 0,
            "last_device_data": "5c3563c0a42acb0024fadc72",
            "last_current_state_history": "5c3464b521eeb7002fdef796",
            "last_event_record": "5c3464b321eeb7002fdef794",
            "last_device_data_battery": "5c2c83e5a42acb0024faa1ce",
            "project": {
              name: "Fase 2"
            },
            "type": null,
            "observations": null
          }
        },
        {
          "line": 5,
          "data": {
            "tag": {
              "code": "4083586",
              "version": "1.0",
              "manufactorer": "Sigfox"
            },
            "weigth": 890,
            "width": 3.525,
            "heigth": 0,
            "length": 3.04,
            "capacity": 24,
            "temperature": 0,
            "active": true,
            "absent": false,
            "absent_time": null,
            "low_battery": false,
            "permanence_time_exceeded": false,
            "current_state": "local_correto",
            "_id": "5c17c512ebad931c8c6d739a",
            "family": {
              name: "LTR6"
            },
            "serial": "72",
            "created_at": "2018-12-17T15:47:30.628Z",
            "update_at": "2019-01-11T19:08:28.617Z",
            "__v": 0,
            "last_device_data": "5c36102ca42acb0024fae1c9",
            "last_event_record": "5c3414c921eeb7002fdef713",
            "last_current_state_history": "5c250b2c32be0f6cbadddba4",
            "last_device_data_battery": "5c33132fa42acb0024fac9c3",
            "project": {
              name: "Fase 2"
            },
            "type": null,
            "observations": null
          }
        }
      ],
      "to_register": [
        {
          "line": 1,
          "data": {
            "family": { name: "Fase 2" },
            "serial": 727,
            "tag": {
              "code": "40801392",
              "version": "1.0",
              "manufactorer": "Aa"
            },
            "weigth": "1100",
            "width": "1.51",
            "height": "3.063",
            "length": "3.78",
            "capacity": "6",
            "project": { name: "Fase 2" },
            "type": "CAVALETE"
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

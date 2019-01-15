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
    return this.http.post(`${environment.url}/imports/control_point_xlsx`, file)
      .catch(this.handleError);
    
    // let result = {
    //   "errors": [
    //     {
    //       "line": 1,
    //       "description": "Type with this name TRANSPORTADORAX do not exists"
    //     }
    //   ],
    //   "updated": [
    //     {
    //       "line": 2,
    //       "data": {
    //         "name": "JSL BVE - OpLog",
    //         "company": "5c17c53062c3a61cba96b3fd",
    //         "type": "5c2fa1d132d19827b5069007",
    //         "full_address": "R. Epifanio Manoel Ignacio, 189 - Sertãozinho, Barra Velha - SC, 88390-000, Brazil",
    //         "geofence": {
    //           "coordinates": [
    //             {
    //               "lat": -26.6218608,
    //               "lng": -48.7178818
    //             }
    //           ],
    //           "radius": 1000,
    //           "type": "c"
    //         }
    //       }
    //     },
    //     {
    //       "line": 3,
    //       "data": {
    //         "name": "TEMPERLANDIA - CAMPO GRANDE",
    //         "company": "5c17c53162c3a61cba96b56c",
    //         "type": "5c2fa1d132d19827b5068fc5",
    //         "full_address": "Av. Gury Marques, 5413 - Universitário, Campo Grande - MS, 79070-005, Brazil",
    //         "geofence": {
    //           "coordinates": [
    //             {
    //               "lat": -20.52879715,
    //               "lng": -54.59750748
    //             }
    //           ],
    //           "radius": 1000,
    //           "type": "c"
    //         }
    //       }
    //     },
    //     {
    //       "line": 4,
    //       "data": {
    //         "name": "TEMPERMAX - SOROCABA",
    //         "company": "5c17c53162c3a61cba96b571",
    //         "type": "5c2fa1d132d19827b5068fc5",
    //         "full_address": "Av. John Boid Dunlop, 681 - Iporanga, Sorocaba - SP, Brazil",
    //         "geofence": {
    //           "coordinates": [
    //             {
    //               "lat": -23.45395279,
    //               "lng": -47.42467117
    //             }
    //           ],
    //           "radius": 1000,
    //           "type": "c"
    //         }
    //       }
    //     },
    //     {
    //       "line": 5,
    //       "data": {
    //         "name": "CEBRACE ITAQUAQUECETUBA",
    //         "company": "5c17c511ebad931c8c6d7357",
    //         "type": "5c2fa1d132d19827b5068fd7",
    //         "full_address": "Estr. Pinheirinho Novo, 1279 - Estância Guatambu, Itaquaquecetuba - SP, 08588-640, Brasil",
    //         "geofence": {
    //           "coordinates": [
    //             {
    //               "lat": -23.442917597503875,
    //               "lng": -46.30935742229843
    //             }
    //           ],
    //           "radius": 1000,
    //           "type": "c"
    //         }
    //       }
    //     },
    //     {
    //       "line": 6,
    //       "data": {
    //         "name": "CEBRACE - FORTALEZA",
    //         "company": "5c17c53162c3a61cba96b5ed",
    //         "type": "5c2fa1d132d19827b5068fd7",
    //         "full_address": "Jangurussu, Fortaleza - CE, Brasil",
    //         "geofence": {
    //           "coordinates": [
    //             {
    //               "lat": -3.8425136113774583,
    //               "lng": -38.50006878376007
    //             }
    //           ],
    //           "radius": 1000,
    //           "type": "c"
    //         }
    //       }
    //     }
    //   ],
    //   "to_register": [
    //     {
    //       "line": 7,
    //       "data": {
    //         "name": "Cin - ufpe",
    //         "company": "5c17c511ebad931c8c6d7357",
    //         "type": "5c2fa1d132d19827b5068fd7",
    //         "full_address": "Av. Prof. Moraes Rego, 1235 - Cidade Universitária, Recife - PE, 50670-901, Brasil",
    //         "geofence": {
    //           "coordinates": [
    //             {
    //               "lat": "-8.0551340502225",
    //               "lng": "-34.95324388941367"
    //             },
    //             {
    //               "lat": "-8.055399624685807",
    //               "lng": "-34.950626053415135"
    //             },
    //             {
    //               "lat": "-8.05696119900596",
    //               "lng": "-34.95073334177573"
    //             },
    //             {
    //               "lat": "-8.056738117329056",
    //               "lng": "-34.95324388941367"
    //             }
    //           ],
    //           "type": "p"
    //         }
    //       }
    //     }
    //   ]
    // };

    // return Observable.of(result);
  }

  sendDataToImportPacking(file: any): Observable<any> {
    return this.http.post(`${environment.url}/imports/packing_xlsx`, file)
      .catch(this.handleError);

    // let result = {
    //   "errors": [
    //     {
    //       "line": 3,
    //       "description": "Family code Ljadasd do not exists"
    //     }
    //   ],
    //   "updated": [
    //     {
    //       "line": 2,
    //       "data": {
    //         "tag": {
    //           "code": "4083565",
    //           "version": "1.0",
    //           "manufactorer": "Sigfox"
    //         },
    //         "weigth": 1400,
    //         "width": 6.87,
    //         "heigth": 0,
    //         "length": 3.04,
    //         "capacity": 24,
    //         "temperature": 0,
    //         "active": true,
    //         "absent": true,
    //         "absent_time": null,
    //         "low_battery": false,
    //         "permanence_time_exceeded": false,
    //         "current_state": "analise",
    //         "_id": "5c17c512ebad931c8c6d735e",
    //         "family": {
    //           name: "LTR6"
    //         },
    //         "serial": "325",
    //         "created_at": "2018-12-17T15:47:30.609Z",
    //         "update_at": "2019-01-11T19:08:28.567Z",
    //         "__v": 0,
    //         "last_device_data": "5c35cc92a42acb0024fade6d",
    //         "last_current_state_history": "5c35ccb421eeb7002fdefcba",
    //         "last_device_data_battery": "5c332c26a42acb0024faca9e",
    //         "project": {
    //           name: "Fase 2"
    //         },
    //         "type": null,
    //         "observations": null
    //       }
    //     },
    //     {
    //       "line": 4,
    //       "data": {
    //         "tag": {
    //           "code": "4082288",
    //           "version": "1.0",
    //           "manufactorer": "Sigfox"
    //         },
    //         "weigth": 1100,
    //         "width": 3.525,
    //         "heigth": 0,
    //         "length": 3.04,
    //         "capacity": 24,
    //         "temperature": 0,
    //         "active": true,
    //         "absent": true,
    //         "absent_time": null,
    //         "low_battery": false,
    //         "permanence_time_exceeded": false,
    //         "current_state": "local_correto",
    //         "_id": "5c17c512ebad931c8c6d7382",
    //         "family": {
    //           name: "LTR6"
    //         },
    //         "serial": "526",
    //         "created_at": "2018-12-17T15:47:30.620Z",
    //         "update_at": "2019-01-11T19:08:28.591Z",
    //         "__v": 0,
    //         "last_device_data": "5c3563c0a42acb0024fadc72",
    //         "last_current_state_history": "5c3464b521eeb7002fdef796",
    //         "last_event_record": "5c3464b321eeb7002fdef794",
    //         "last_device_data_battery": "5c2c83e5a42acb0024faa1ce",
    //         "project": {
    //           name: "Fase 2"
    //         },
    //         "type": null,
    //         "observations": null
    //       }
    //     },
    //     {
    //       "line": 5,
    //       "data": {
    //         "tag": {
    //           "code": "4083586",
    //           "version": "1.0",
    //           "manufactorer": "Sigfox"
    //         },
    //         "weigth": 890,
    //         "width": 3.525,
    //         "heigth": 0,
    //         "length": 3.04,
    //         "capacity": 24,
    //         "temperature": 0,
    //         "active": true,
    //         "absent": false,
    //         "absent_time": null,
    //         "low_battery": false,
    //         "permanence_time_exceeded": false,
    //         "current_state": "local_correto",
    //         "_id": "5c17c512ebad931c8c6d739a",
    //         "family": {
    //           name: "LTR6"
    //         },
    //         "serial": "72",
    //         "created_at": "2018-12-17T15:47:30.628Z",
    //         "update_at": "2019-01-11T19:08:28.617Z",
    //         "__v": 0,
    //         "last_device_data": "5c36102ca42acb0024fae1c9",
    //         "last_event_record": "5c3414c921eeb7002fdef713",
    //         "last_current_state_history": "5c250b2c32be0f6cbadddba4",
    //         "last_device_data_battery": "5c33132fa42acb0024fac9c3",
    //         "project": {
    //           name: "Fase 2"
    //         },
    //         "type": null,
    //         "observations": null
    //       }
    //     }
    //   ],
    //   "to_register": [
    //     {
    //       "line": 1,
    //       "data": {
    //         "family": { name: "Fase 2" },
    //         "serial": 727,
    //         "tag": {
    //           "code": "40801392",
    //           "version": "1.0",
    //           "manufactorer": "Aa"
    //         },
    //         "weigth": "1100",
    //         "width": "1.51",
    //         "height": "3.063",
    //         "length": "3.78",
    //         "capacity": "6",
    //         "project": { name: "Fase 2" },
    //         "type": "CAVALETE"
    //       }
    //     }
    //   ]
    // }

    // return Observable.of(result);
  }

  sendDataToImportRoute(file: any): Observable<any> {
    return this.http.post(`${environment.url}upload/route`, file)
      .catch(this.handleError);
  }

}

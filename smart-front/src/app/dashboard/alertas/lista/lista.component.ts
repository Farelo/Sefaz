import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AlertaModalComponent } from '../../../shared/modal-alerta/alerta.component';
import { AlertsService } from '../../../servicos/index.service';
import { Alert } from '../../../shared/models/alert';
import { Pagination } from '../../../shared/models/pagination';
import { AlertaAusenteComponent } from '../../../shared/modal-alerta/alerta-ausente/alerta-ausente.component';
import { AlertaLocalIncorretoComponent } from '../../../shared/modal-alerta/alerta-local-incorreto/alerta-local-incorreto.component';
import { AlertaBateriaBaixaComponent } from '../../../shared/modal-alerta/alerta-bateria-baixa/alerta-bateria-baixa.component';
import { AlertaEmbalagemAtrasadaComponent } from '../../../shared/modal-alerta/alerta-embalagem-atrasada/alerta-embalagem-atrasada.component';
import { AlertaPermanenciaComponent } from '../../../shared/modal-alerta/alerta-permanencia/alerta-permanencia.component';
import { AlertaEmbalagemPerdidaComponent } from '../../../shared/modal-alerta/alerta-embalagem-perdida/alerta-embalagem-perdida.component';

@Component({
  selector: 'lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  public data: Pagination = new Pagination({ meta: { page: 1 } });
  alerts: Alert[];
  public code;
  public supplier;
  public project;
  public status;
  alert: Alert;
  inscricao: Subscription;

  constructor(
    private AlertsService: AlertsService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal) { }

  ngOnInit() {

    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.code = params['code'];
        this.status = params['status'];
        this.project = params['project'];
        this.supplier = params['supplier'];
        this.getAlerts();
      }
    )
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  getAlerts() {
    this.AlertsService.getAlertsPaginationByHashing(10, this.data.meta.page, this.code, this.project, this.supplier, this.status)
      .subscribe(alerts => {
        this.data = alerts;

        // this.data.data.push({
        //   "_id": "5b742dad9aba123658a96c89",
        //   "department": {
        //     "_id": "5ace4592eb3db0000f292ebf",
        //     "name": "CEVA LOGISTIC",
        //     "lat": -29.93458030771551,
        //     "lng": -50.910850672921015,
        //     "plant": "5ac17f8b8431ce000f973d87",
        //     "__v": 0
        //   },
        //   "packing": {
        //     "_id": "5ace4014eb3db0000f292e2d",
        //     "code": "30-1301",
        //     "type": "Rack Painel Conj",
        //     "weigth": 238,
        //     "width": 1.2,
        //     "heigth": 1.2,
        //     "length": 1.65,
        //     "capacity": 16,
        //     "problem": false,
        //     "missing": false,
        //     "traveling": false,
        //     "serial": "009",
        //     "tag": "5ac17e638431ce000f973d81",
        //     "code_tag": "5042512",
        //     "supplier": "5ac18aa18431ce000f973d96",
        //     "project": "5ac180a28431ce000f973d8a",
        //     "hashPacking": "5ac18aa18431ce000f973d9630-1301",
        //     "__v": 0,
        //     "battery": 59.5588,
        //     "lastCommunication": 1534153182,
        //     "temperature": 19,
        //     "last_department": "5ace4592eb3db0000f292ebf",
        //     "gc16": "5acf485feb3db0000f292f3e",
        //     "department": "5ace4592eb3db0000f292ebf",
        //     "actual_plant": {
        //       "plant": "5ac17f8b8431ce000f973d87",
        //       "local": "Factory"
        //     },
        //     "last_plant": {
        //       "plant": "5ac17f8b8431ce000f973d87"
        //     },
        //     "routes": [
        //       "5acf3b01eb3db0000f292f20"
        //     ],
        //     "actual_gc16": {
        //       "days": 2,
        //       "max": 3,
        //       "min": 2
        //     },
        //     "position": {
        //       "latitude": -29.9346,
        //       "longitude": -50.91,
        //       "accuracy": 12010,
        //       "date": 1534153182
        //     },
        //     "packing_missing": {
        //       "date": 0,
        //       "time_countdown": 0
        //     },
        //     "trip": {
        //       "time_exceeded": false,
        //       "date": 0,
        //       "time_countdown": 0,
        //       "date_late": 0,
        //       "time_late": 0
        //     },
        //     "permanence": {
        //       "amount_days_exceeded": 3712730124,
        //       "date_exceeded": 1534340525395,
        //       "amount_days": 3892486194,
        //       "date": 1534160769324,
        //       "time_exceeded": true
        //     },
        //     "incontida": {
        //       "date": 0,
        //       "time": 0,
        //       "isIncontida": false
        //     },
        //     "status_pt": "TEMPO DE PERMANENCIA",
        //     "status": "PERMANENCE_EXCEEDED"
        //   },
        //   "project": "5ac180a28431ce000f973d8a",
        //   "supplier": {
        //     "_id": "5ac18aa18431ce000f973d96",
        //     "name": "BRUNING TECNOMETAL S/A.",
        //     "duns": "897120846",
        //     "plant": {
        //       "_id": "5ac18aa18431ce000f973d95",
        //       "plant_name": "BRUNING TECNOMETAL - PANAMBY",
        //       "lat": -28.26500202094906,
        //       "lng": -53.494277000427246,
        //       "location": "Fritsch, Panambi - RS, 98280-000, Brasil",
        //       "__v": 0,
        //       "supplier": "5ac18aa18431ce000f973d96"
        //     },
        //     "cnpj": "",
        //     "profile": "5ac18aa18431ce000f973d94",
        //     "__v": 0
        //   },
        //   "status": 6,
        //   "hashpacking": "5ac18aa18431ce000f973d9630-1301",
        //   "serial": "009",
        //   "date": 1534340525458,
        //   "__v": 0,
        //   "routes": [
        //     {
        //       "_id": "5acf3b01eb3db0000f292f20",
        //       "supplier": {
        //         "_id": "5ac18aa18431ce000f973d96",
        //         "name": "BRUNING TECNOMETAL S/A.",
        //         "duns": "897120846",
        //         "plant": "5ac18aa18431ce000f973d95",
        //         "cnpj": "",
        //         "profile": "5ac18aa18431ce000f973d94",
        //         "__v": 0
        //       },
        //       "project": "5ac180a28431ce000f973d8a",
        //       "plant_factory": {
        //         "_id": "5ac17f8b8431ce000f973d87",
        //         "plant_name": "GM Gravatai",
        //         "lat": -29.938966806881297,
        //         "lng": -50.917041044414304,
        //         "location": "Vila Morada Gaúcha, Gravataí - RS, Brasil",
        //         "__v": 0
        //       },
        //       "plant_supplier": {
        //         "_id": "5ac18aa18431ce000f973d95",
        //         "plant_name": "BRUNING TECNOMETAL - PANAMBY",
        //         "lat": -28.26500202094906,
        //         "lng": -53.494277000427246,
        //         "location": "Fritsch, Panambi - RS, 98280-000, Brasil",
        //         "__v": 0,
        //         "supplier": "5ac18aa18431ce000f973d96"
        //       },
        //       "packing_code": "30-1301",
        //       "hashPacking": "5ac18aa18431ce000f973d96undefined",
        //       "__v": 0,
        //       "location": {
        //         "start_address": "Rua Interna da General Motors Gravataí - Gravataí - RS, Brasil, 9504 - Vila Morada Gaúcha, Gravataí - RS, Brasil",
        //         "end_address": "R. Vinte e Cinco de Julho, 903-1219 - Zona Norte, Panambi - RS, 98280-000, Brasil",
        //         "duration": {
        //           "text": "5 horas 6 minutos",
        //           "value": 18387
        //         },
        //         "distance": {
        //           "text": "398 km",
        //           "value": 397698
        //         }
        //       },
        //       "time": {
        //         "max": 43200000,
        //         "min": 28800000
        //       }
        //     }
        //   ],
        //   "actual_plant": {
        //     "local": "Factory",
        //     "plant": {
        //       "_id": "5ac17f8b8431ce000f973d87",
        //       "plant_name": "GM Gravatai",
        //       "lat": -29.938966806881297,
        //       "lng": -50.917041044414304,
        //       "location": "Vila Morada Gaúcha, Gravataí - RS, Brasil",
        //       "__v": 0
        //     }
        //   }
        // });
      },
        err => {
          console.log(err);
        });
  }

  open(embalagem, status) {

    this.AlertsService.retrieveAlertByPacking(embalagem, status)
      .subscribe(result => {

        // if (status == 1 ){
        //   const modalRef = this.modalService.open(AlertaModalComponent, { backdrop: "static", size: "lg" });
        //   modalRef.componentInstance.alerta = result;
        // }else{
        //   const modalRef = this.modalService.open(AlertaModalComponent, { backdrop: "static" });
        //   modalRef.componentInstance.alerta = result;
        // }

        // Embalagem Ausente
        if (status == 1) {
          const modalRef = this.modalService.open(AlertaAusenteComponent, { backdrop: "static", size: "lg" });
          modalRef.componentInstance.alerta = result;

          // Local Incorreto
        } else if (status == 2) {
          const modalRef = this.modalService.open(AlertaLocalIncorretoComponent, { backdrop: "static" });
          modalRef.componentInstance.alerta = result;

          // Bateria Baixa
        } else if (status == 3) {
          const modalRef = this.modalService.open(AlertaBateriaBaixaComponent, { backdrop: "static" });
          modalRef.componentInstance.alerta = result;

          // Embalagem Atrasada
        } else if (status == 4) {
          const modalRef = this.modalService.open(AlertaEmbalagemAtrasadaComponent, { backdrop: "static" });
          modalRef.componentInstance.alerta = result;

        } else if (status == 5) {
          const modalRef = this.modalService.open(AlertaPermanenciaComponent, { backdrop: "static" });
          modalRef.componentInstance.alerta = result;

        } else if (status == 6) {
          const modalRef = this.modalService.open(AlertaEmbalagemPerdidaComponent, { backdrop: "static" });
          //modalRef.componentInstance.alerta = result;
          // modalRef.componentInstance.alerta = {
          //   "jsonapi": {
          //     "version": "1.0"
          //   },
          //   "refresh_token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZTNkMjEzYjg0ZjliMDAwZmEwMjM2OCIsImlhdCI6MTUzODA1MzI2MSwiZXhwIjoxNTM4MDYwNDYxfQ.XP99hjrKNZUR5rNsIjXXytrDimVQmmsN838i2Y_zHP0",
          //   "status": 200,
          //   "data": {
          //     "_id": "5b742dad9aba123658a96c89",
          //     "department": {
          //       "_id": "5ace4592eb3db0000f292ebf",
          //       "name": "CEVA LOGISTIC",
          //       "lat": -29.93458030771551,
          //       "lng": -50.910850672921015,
          //       "plant": "5ac17f8b8431ce000f973d87",
          //       "__v": 0
          //     },
          //     "packing": {
          //       "_id": "5ace4014eb3db0000f292e2d",
          //       "code": "30-1301",
          //       "type": "Rack Painel Conj",
          //       "weigth": 238,
          //       "width": 1.2,
          //       "heigth": 1.2,
          //       "length": 1.65,
          //       "capacity": 16,
          //       "problem": false,
          //       "missing": false,
          //       "traveling": false,
          //       "serial": "009",
          //       "tag": "5ac17e638431ce000f973d81",
          //       "code_tag": "5042512",
          //       "supplier": "5ac18aa18431ce000f973d96",
          //       "project": "5ac180a28431ce000f973d8a",
          //       "hashPacking": "5ac18aa18431ce000f973d9630-1301",
          //       "__v": 0,
          //       "battery": 59.5588,
          //       "lastCommunication": 1534153182,
          //       "temperature": 19,
          //       "last_department": "5ace4592eb3db0000f292ebf",
          //       "gc16": "5acf485feb3db0000f292f3e",
          //       "department": "5ace4592eb3db0000f292ebf",
          //       "actual_plant": {
          //         "plant": "5ac17f8b8431ce000f973d87",
          //         "local": "Factory"
          //       },
          //       "last_plant": {
          //         "plant": "5ac17f8b8431ce000f973d87"
          //       },
          //       "routes": [
          //         "5acf3b01eb3db0000f292f20"
          //       ],
          //       "actual_gc16": {
          //         "days": 2,
          //         "max": 3,
          //         "min": 2
          //       },
          //       "position": {
          //         "latitude": -29.9346,
          //         "longitude": -50.91,
          //         "accuracy": 12010,
          //         "date": 1534153182
          //       },
          //       "packing_missing": {
          //         "date": 0,
          //         "time_countdown": 0
          //       },
          //       "trip": {
          //         "time_exceeded": false,
          //         "date": 0,
          //         "time_countdown": 0,
          //         "date_late": 0,
          //         "time_late": 0
          //       },
          //       "permanence": {
          //         "amount_days_exceeded": 3712730124,
          //         "date_exceeded": 1534340525395,
          //         "amount_days": 3892486194,
          //         "date": 1534160769324,
          //         "time_exceeded": true
          //       },
          //       "incontida": {
          //         "date": 0,
          //         "time": 0,
          //         "isIncontida": false
          //       },
          //       "status_pt": "TEMPO DE PERMANENCIA",
          //       "status": "PERMANENCE_EXCEEDED"
          //     },
          //     "project": "5ac180a28431ce000f973d8a",
          //     "supplier": {
          //       "_id": "5ac18aa18431ce000f973d96",
          //       "name": "BRUNING TECNOMETAL S/A.",
          //       "duns": "897120846",
          //       "plant": {
          //         "_id": "5ac18aa18431ce000f973d95",
          //         "plant_name": "BRUNING TECNOMETAL - PANAMBY",
          //         "lat": -28.26500202094906,
          //         "lng": -53.494277000427246,
          //         "location": "Fritsch, Panambi - RS, 98280-000, Brasil",
          //         "__v": 0,
          //         "supplier": "5ac18aa18431ce000f973d96"
          //       },
          //       "cnpj": "",
          //       "profile": "5ac18aa18431ce000f973d94",
          //       "__v": 0
          //     },
          //     "status": 6,
          //     "hashpacking": "5ac18aa18431ce000f973d9630-1301",
          //     "serial": "009",
          //     "date": 1534340525458,
          //     "__v": 0,
          //     "routes": [
          //       {
          //         "_id": "5acf3b01eb3db0000f292f20",
          //         "supplier": {
          //           "_id": "5ac18aa18431ce000f973d96",
          //           "name": "BRUNING TECNOMETAL S/A.",
          //           "duns": "897120846",
          //           "plant": "5ac18aa18431ce000f973d95",
          //           "cnpj": "",
          //           "profile": "5ac18aa18431ce000f973d94",
          //           "__v": 0
          //         },
          //         "project": "5ac180a28431ce000f973d8a",
          //         "plant_factory": {
          //           "_id": "5ac17f8b8431ce000f973d87",
          //           "plant_name": "GM Gravatai",
          //           "lat": -29.938966806881297,
          //           "lng": -50.917041044414304,
          //           "location": "Vila Morada Gaúcha, Gravataí - RS, Brasil",
          //           "__v": 0
          //         },
          //         "plant_supplier": {
          //           "_id": "5ac18aa18431ce000f973d95",
          //           "plant_name": "BRUNING TECNOMETAL - PANAMBY",
          //           "lat": -28.26500202094906,
          //           "lng": -53.494277000427246,
          //           "location": "Fritsch, Panambi - RS, 98280-000, Brasil",
          //           "__v": 0,
          //           "supplier": "5ac18aa18431ce000f973d96"
          //         },
          //         "packing_code": "30-1301",
          //         "hashPacking": "5ac18aa18431ce000f973d96undefined",
          //         "__v": 0,
          //         "location": {
          //           "start_address": "Rua Interna da General Motors Gravataí - Gravataí - RS, Brasil, 9504 - Vila Morada Gaúcha, Gravataí - RS, Brasil",
          //           "end_address": "R. Vinte e Cinco de Julho, 903-1219 - Zona Norte, Panambi - RS, 98280-000, Brasil",
          //           "duration": {
          //             "text": "5 horas 6 minutos",
          //             "value": 18387
          //           },
          //           "distance": {
          //             "text": "398 km",
          //             "value": 397698
          //           }
          //         },
          //         "time": {
          //           "max": 43200000,
          //           "min": 28800000
          //         }
          //       }
          //     ],
          //     "actual_plant": {
          //       "local": "Factory",
          //       "plant": {
          //         "_id": "5ac17f8b8431ce000f973d87",
          //         "plant_name": "GM Gravatai",
          //         "lat": -29.938966806881297,
          //         "lng": -50.917041044414304,
          //         "location": "Vila Morada Gaúcha, Gravataí - RS, Brasil",
          //         "__v": 0
          //       }
          //     }
          //   }
          // };
        }

      },
        err => {
          console.log(err);
        });
  }

  pageChanged(page: any): void {
    this.data.meta.page = page;
    this.getAlerts();
  }

  getAlertText(code: number): string {
    let result: string = '';

    switch (code) {
      case 1:
        result = 'Embalagem Ausente';
        break;

      case 2:
        result = 'Embalagem em local incorreto';
        break;

      case 3:
        result = 'Embalagem com bateria baixa';
        break;

      case 4:
        result = 'Embalagem em viagem';
        break;

      case 5:
        result = 'Embalagem com tempo de permanência elevado';
        break;

      case 6:
        result = 'Embalagem perdida';
        break;
    }

    return result;
  }
}

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

        this.data.data.push({
          "_id": "5b5617276a8b8512bc8a62c2",
          "quantity": 1,
          "packing": {
            "_id": "5ac81202f96dea00107babe3",
            "code": "30-1605",
            "type": "Rack do Escapamento",
            "weigth": 185,
            "width": 1.2,
            "heigth": 1.25,
            "length": 3.25,
            "capacity": 16,
            "problem": true,
            "missing": false,
            "traveling": false,
            "serial": "009",
            "tag": "5ac17e638431ce000f973d6d",
            "code_tag": "5041405",
            "supplier": "5ac186d18431ce000f973d90",
            "project": "5ac180a28431ce000f973d8a",
            "hashPacking": "5ac186d18431ce000f973d9030-1605",
            "routes": [
              "5ac83257f96dea00107bac0a"
            ],
            "__v": 0,
            "battery": 18.3824,
            "lastCommunication": 1531683547,
            "position": {
              "latitude": -23.6122,
              "longitude": -46.5504,
              "accuracy": 32000,
              "date": 1531683547
            },
            "temperature": 13,
            "packing_missing": {
              "date": 0,
              "time_countdown": 0
            },
            "permanence": {
              "date": 1532368679156,
              "amount_days": 5613476527,
              "time_exceeded": false
            },
            "trip": {
              "time_exceeded": false,
              "date": 0,
              "time_countdown": 0,
              "date_late": 0,
              "time_late": 0
            },
            "last_department": null,
            "last_plant": {
              "plant": "5ac17fed8431ce000f973d88"
            },
            "gc16": "5acf48eeeb3db0000f292f3f",
            "actual_gc16": {
              "days": 5,
              "max": 4,
              "min": 4
            },
            "department": null,
            "actual_plant": {
              "local": "Supplier",
              "plant": "5ac18eab8431ce000f973d98"
            },
            "status": "INCORRECT_LOCAL",
            "incontida": {
              "date": 0,
              "time": 0,
              "isIncontida": false
            },
            "status_pt": "LOCAL_INCORRETO"
          },
          "supplier": {
            "_id": "5ac186d18431ce000f973d90",
            "name": "MAGNETI MARELLI ESCAPAMENTOS AMPARO",
            "duns": "914577945",
            "plant": "5ac186d18431ce000f973d8f",
            "cnpj": "",
            "profile": "5ac186d18431ce000f973d8e",
            "__v": 0
          },
          "project": {
            "_id": "5ac180a28431ce000f973d8a",
            "name": "Piloto1",
            "__v": 0
          },
          "plant": {
            "_id": "5ac18eab8431ce000f973d98",
            "plant_name": "BENTELER _ Syncreon",
            "lat": -23.612092152852963,
            "lng": -46.543718576431274,
            "location": "Tamanduateí 2, Santo André - SP, Brasil",
            "__v": 0,
            "supplier": "5ac18eab8431ce000f973d99"
          },
          "status": 6,
          "date": 1532368679173,
          "serial": "009"
        });
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
          // modalRef.componentInstance.alerta = {
          //   "jsonapi": {
          //     "version": "1.0"
          //   },
          //   "refresh_token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZTNkMjEzYjg0ZjliMDAwZmEwMjM2OCIsImlhdCI6MTUzNzk4Mzk1MywiZXhwIjoxNTM3OTkxMTUzfQ.1lf0869IddF4KOpFvkgaWc-zIY6_lEZ6koT_g_qKKk4",
          //   "status": 200,
          //   "data": {
          //     "_id": "5b3a0d2c9d13612fe8170319",
          //     "department": null,
          //     "packing": {
          //       "_id": "5ac640688431ce000f973f1c",
          //       "code": "30-1107",
          //       "type": "Carrinho Amortecedor",
          //       "weigth": 197,
          //       "width": 0.8,
          //       "heigth": 1.35,
          //       "length": 1.03,
          //       "capacity": 24,
          //       "problem": false,
          //       "missing": false,
          //       "traveling": false,
          //       "serial": "006",
          //       "gc16": "5ac4b5db8431ce000f973e50",
          //       "tag": "5ac17e638431ce000f973d5a",
          //       "code_tag": "5040260",
          //       "supplier": "5ac18eab8431ce000f973d99",
          //       "project": "5ac180a28431ce000f973d8a",
          //       "hashPacking": "5ac18eab8431ce000f973d9930-1107",
          //       "__v": 0,
          //       "battery": 18.3824,
          //       "lastCommunication": 1530505916,
          //       "temperature": 18,
          //       "last_department": null,
          //       "department": null,
          //       "actual_plant": {
          //         "plant": "5ac17fed8431ce000f973d88",
          //         "local": "Factory"
          //       },
          //       "last_plant": {
          //         "plant": "5ac17fed8431ce000f973d88"
          //       },
          //       "routes": [
          //         "5ac4268e8431ce000f973e06"
          //       ],
          //       "actual_gc16": {
          //         "days": 4,
          //         "max": 3,
          //         "min": 3
          //       },
          //       "position": {
          //         "latitude": -23.6146,
          //         "longitude": -46.5642,
          //         "accuracy": 32000,
          //         "date": 1530505717
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
          //         "amount_days_exceeded": 0,
          //         "amount_days": 7452788842,
          //         "date": 1530531116620,
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
          //     "supplier": {
          //       "_id": "5ac18eab8431ce000f973d99",
          //       "name": "BENTELER COMPON",
          //       "duns": "901268607",
          //       "plant": {
          //         "_id": "5ac18eab8431ce000f973d98",
          //         "plant_name": "BENTELER _ Syncreon",
          //         "lat": -23.612092152852963,
          //         "lng": -46.543718576431274,
          //         "location": "Tamanduateí 2, Santo André - SP, Brasil",
          //         "__v": 0,
          //         "supplier": "5ac18eab8431ce000f973d99"
          //       },
          //       "cnpj": "",
          //       "profile": "5ac18eab8431ce000f973d97",
          //       "__v": 0
          //     },
          //     "project": "5ac180a28431ce000f973d8a",
          //     "status": 3,
          //     "hashpacking": "5ac18eab8431ce000f973d9930-1107",
          //     "serial": "006",
          //     "date": 1530531116650,
          //     "__v": 0,
          //     "routes": [
          //       {
          //         "_id": "5ac4268e8431ce000f973e06",
          //         "supplier": {
          //           "_id": "5ac18eab8431ce000f973d99",
          //           "name": "BENTELER COMPON",
          //           "duns": "901268607",
          //           "plant": "5ac18eab8431ce000f973d98",
          //           "cnpj": "",
          //           "profile": "5ac18eab8431ce000f973d97",
          //           "__v": 0
          //         },
          //         "project": "5ac180a28431ce000f973d8a",
          //         "plant_factory": {
          //           "_id": "5ac17fed8431ce000f973d88",
          //           "plant_name": "GM SCS - MASC",
          //           "lat": -23.612841430156006,
          //           "lng": -46.56609858076274,
          //           "location": "Santa Paula, São Caetano do Sul - SP, Brasil",
          //           "__v": 0
          //         },
          //         "plant_supplier": {
          //           "_id": "5ac18eab8431ce000f973d98",
          //           "plant_name": "BENTELER _ Syncreon",
          //           "lat": -23.612092152852963,
          //           "lng": -46.543718576431274,
          //           "location": "Tamanduateí 2, Santo André - SP, Brasil",
          //           "__v": 0,
          //           "supplier": "5ac18eab8431ce000f973d99"
          //         },
          //         "packing_code": "30-1107",
          //         "hashPacking": "5ac18eab8431ce000f973d99undefined",
          //         "__v": 0,
          //         "location": {
          //           "start_address": "R. João Pessoa, 73 - Prosperidade, São Caetano do Sul - SP, Brasil",
          //           "end_address": "R. Interna Mercedes Benz, 381 - Distrito Industrial, Campinas - SP, Brasil",
          //           "duration": {
          //             "text": "1 hora 30 minutos",
          //             "value": 5391
          //           },
          //           "distance": {
          //             "text": "99,9 km",
          //             "value": 99863
          //           }
          //         },
          //         "time": {
          //           "max": 7200000,
          //           "min": 3600000
          //         }
          //       }
          //     ],
          //     "actual_plant": {
          //       "local": "Factory",
          //       "plant": {
          //         "_id": "5ac17fed8431ce000f973d88",
          //         "plant_name": "GM SCS - MASC",
          //         "lat": -23.612841430156006,
          //         "lng": -46.56609858076274,
          //         "location": "Santa Paula, São Caetano do Sul - SP, Brasil",
          //         "__v": 0
          //       }
          //     }
          //   }
          // };
        }

        // }else{
        //   const modalRef = this.modalService.open(AlertaModalComponent, { backdrop: "static" });
        //   modalRef.componentInstance.alerta = result;
        // } 
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

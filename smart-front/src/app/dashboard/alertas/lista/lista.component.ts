import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AlertaModalComponent } from '../../../shared/modal-alerta/alerta.component';
import { AlertsService } from '../../../servicos/index.service';
import { Alert } from '../../../shared/models/alert';
import { Pagination } from '../../../shared/models/pagination';

@Component({
  selector: 'lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
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
    private modalService: NgbModal ) { }

  ngOnInit() {

    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        this.code = params ['code'];
        this.status = params ['status'];
        this.project = params ['project'];
        this.supplier = params ['supplier'];
        this.getAlerts();
      }
    )
  }

  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }

  getAlerts(){
    this.AlertsService.getAlertsPaginationByHashing(10,this.data.meta.page,this.code,this.project,this.supplier,this.status)
      .subscribe(alerts => {
        this.data = alerts;

        this.data.data.push({
          "_id": "5baa251f068d87047c041ae3",
          "quantity": 1,
          "packing": {
            "_id": "5aa991d9458c230014c225d5",
            "length": 6.87,
            "code": "LJ",
            "serial": "3",
            "tag": "5aa835de458c230014c21b86",
            "type": "Jumbo",
            "capacity": 24,
            "supplier": "5aa96e2e458c230014c225a1",
            "project": "5aa91566458c230014c21b91",
            "weigth": 1400,
            "width": 1.51,
            "heigth": 3.04,
            "code_tag": "5041673",
            "hashPacking": "5aa96e2e458c230014c225a1LJ",
            "routes": [
              "5af5eb305328e4001526943f",
              "5af5ebb25328e4001526944a"
            ],
            "__v": 0,
            "battery": 71.3235,
            "lastCommunication": 1537893673,
            "position": {
              "latitude": -23.4489,
              "longitude": -46.4496,
              "accuracy": 100,
              "date": 1537893673
            },
            "temperature": 32,
            "permanence": {
              "amount_days": 30725661,
              "date": 1537877279625,
              "time_exceeded": false
            },
            "problem": true,
            "last_department": null,
            "last_plant": {
              "plant": "5aa96e2e458c230014c225a0"
            },
            "missing": false,
            "packing_missing": {
              "date": 0,
              "time_countdown": 0
            },
            "traveling": false,
            "trip": {
              "time_exceeded": false,
              "date": 0,
              "time_countdown": 0,
              "date_late": 0,
              "time_late": 0
            },
            "status": "INCORRECT_LOCAL",
            "incontida": {
              "date": 0,
              "time": 0,
              "isIncontida": false
            },
            "status_pt": "LOCAL_INCORRETO",
            "actual_plant": {
              "plant": "5af5cf8c5328e40015268fe3",
              "local": "Factory"
            },
            "department": null
          },
          "supplier": {
            "_id": "5aa96e2e458c230014c225a1",
            "name": "CEBRACE JACAREI",
            "duns": "123123123",
            "plant": "5aa96e2e458c230014c225a0",
            "cnpj": "",
            "profile": "5aa96e2d458c230014c2259f",
            "__v": 0
          },
          "project": {
            "_id": "5aa91566458c230014c21b91",
            "name": "Piloto 1",
            "__v": 0
          },
          "plant": {
            "_id": "5af5cf8c5328e40015268fe3",
            "plant_name": "THERMOGLASS - GUARULHOS",
            "lat": -23.44722748,
            "lng": -46.44739151,
            "location": "R. Joaquina Teófilo do Espírito Santo, 247 - Cumbica, Guarulhos - SP, Brazil",
            "__v": 0
          },
          "status": 7,
          "date": 1537877279829,
          "serial": "3"
        });
      },
      err => {
        console.log(err);
      });
  }

  open(embalagem, status) {

    this.AlertsService.retrieveAlertByPacking(embalagem, status)
      .subscribe(result => {
       
        if (status == 1 ){
          const modalRef = this.modalService.open(AlertaModalComponent, { backdrop: "static", size: "lg" });
          modalRef.componentInstance.alerta = result;

        }else{
          const modalRef = this.modalService.open(AlertaModalComponent, { backdrop: "static" });
          modalRef.componentInstance.alerta = result;
        }

      }, err => { console.log(err); });
  }

  pageChanged(page: any): void{
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
    }

    return result;
  }
}

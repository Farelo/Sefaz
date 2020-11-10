import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Rx";
import { Router } from "@angular/router";
import { AlertaModalComponent } from "../../../shared/modal-alerta/alerta.component";
import {
  AlertsService,
  AuthenticationService,
} from "../../../servicos/index.service";
import { Alert } from "../../../shared/models/alert";
import { Pagination } from "../../../shared/models/pagination";
import { AlertaAusenteComponent } from "../../../shared/modal-alerta/alerta-ausente/alerta-ausente.component";
import { AlertaLocalIncorretoComponent } from "../../../shared/modal-alerta/alerta-local-incorreto/alerta-local-incorreto.component";
import { AlertaBateriaBaixaComponent } from "../../../shared/modal-alerta/alerta-bateria-baixa/alerta-bateria-baixa.component";
import { AlertaEmbalagemAtrasadaComponent } from "../../../shared/modal-alerta/alerta-embalagem-atrasada/alerta-embalagem-atrasada.component";
import { AlertaPermanenciaComponent } from "../../../shared/modal-alerta/alerta-permanencia/alerta-permanencia.component";
import { AlertaEmbalagemPerdidaComponent } from "../../../shared/modal-alerta/alerta-embalagem-perdida/alerta-embalagem-perdida.component";
import { constants } from "environments/constants";
import { AlertaSemSinalComponent } from "app/shared/modal-alerta/alerta-sem-sinal/alerta-sem-sinal.component";
import { AlertaDispositivoRemovidoComponent } from "../../../shared/modal-alerta/alerta-dispositivo-removido/alerta-dispositivo-removido.component";

@Component({
  selector: "lista",
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.css"],
})
export class ListaComponent implements OnInit {
  public listOfAlerts: any[] = [];
  public listOfAlertsActualPage: number = -1;

  public familyId;
  public currentState;

  public alertCode: any = 0;
  public mConstants: any;

  alerts: Alert[];
  alert: Alert;
  inscricao: Subscription;

  constructor(
    private alertsService: AlertsService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.mConstants = constants;
  }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.familyId = params["family_id"];
      this.currentState = params["current_state"];
      this.alertCode = this.getAlertCode(this.currentState);

      this.getAlerts();

      // this.currentState = constants.ALERTS.PERMANENCE_TIME;
      // this.alertCode = constants.ALERTS_CODE.PERMANENCE_TIME;

      // console.log(this.currentState);
      // console.log(this.alertCode);
    });
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  getAlerts() {
    this.alertsService
      .getAlertsByFamily(this.familyId, this.currentState)
      .subscribe(
        (alerts: any[]) => {
          this.listOfAlerts = alerts;

          // this.listOfAlerts = alerts.filter(elem => {
          //   return ((elem.current_state != constants.ALERTS.UNABLE_WITH_SIGNAL) &&
          //     (elem.current_state != constants.ALERTS.UNABLE_NO_SIGNAL) &&
          //     (elem.current_state != constants.ALERTS.ANALISYS) &&
          //     (elem.current_state != constants.ALERTS.TRAVELING) &&
          //     (elem.current_state != constants.ALERTS.CORRECT_LOCAL));
          // });
          //console.log(this.listOfAlerts);
        },
        (err) => console.log(err)
      );
  }

  open(embalagem, status) {
    // this.alertsService.retrieveAlertByPacking(embalagem, status)
    //   .subscribe(result => {

    // console.log(embalagem);
    console.log(this.alertCode);
    console.log(constants.ALERTS_CODE.DEVICE_REMOVED);
    // Análise
    if (this.alertCode == constants.ALERTS_CODE.ANALISYS) {
      console.log("open 0");
      const modalRef = this.modalService.open(AlertaAusenteComponent, {
        backdrop: "static",
        size: "lg",
      });
      modalRef.componentInstance.alerta = embalagem;

      // Embalagem Ausente
    } else if (this.alertCode == constants.ALERTS_CODE.ABSENT) {
      console.log("open 1");
      const modalRef = this.modalService.open(AlertaAusenteComponent, {
        backdrop: "static",
        size: "lg",
      });
      modalRef.componentInstance.alerta = embalagem;

      // Local Incorreto
    } else if (this.alertCode == constants.ALERTS_CODE.INCORRECT_LOCAL) {
      console.log("open 2");
      const modalRef = this.modalService.open(AlertaLocalIncorretoComponent, {
        backdrop: "static",
      });
      modalRef.componentInstance.alerta = embalagem;

      // Bateria Baixa
    } else if (this.alertCode == constants.ALERTS_CODE.LOW_BATTERY) {
      console.log("open 3");
      const modalRef = this.modalService.open(AlertaBateriaBaixaComponent, {
        backdrop: "static",
      });
      modalRef.componentInstance.alerta = embalagem;

      // Embalagem Atrasada
    } else if (this.alertCode == constants.ALERTS_CODE.LATE) {
      console.log("open 4");
      const modalRef = this.modalService.open(
        AlertaEmbalagemAtrasadaComponent,
        { backdrop: "static" }
      );
      modalRef.componentInstance.alerta = embalagem;

      //Tempo de permanência
    } else if (this.alertCode == constants.ALERTS_CODE.PERMANENCE_TIME) {
      console.log("open 5");
      const modalRef = this.modalService.open(AlertaPermanenciaComponent, {
        backdrop: "static",
      });
      modalRef.componentInstance.alerta = embalagem;

      //Perdida
    } else if (this.alertCode == constants.ALERTS_CODE.MISSING) {
      console.log("open 6");
      const modalRef = this.modalService.open(AlertaEmbalagemPerdidaComponent, {
        backdrop: "static",
      });
      modalRef.componentInstance.alerta = embalagem;

      //Sem sinal
    } else if (this.alertCode == constants.ALERTS_CODE.NO_SIGNAL) {
      console.log("open 7");
      const modalRef = this.modalService.open(AlertaSemSinalComponent, {
        backdrop: "static",
      });
      modalRef.componentInstance.alerta = embalagem;

      //Removido
    } else if (this.alertCode == constants.ALERTS_CODE.DEVICE_REMOVED) {
      console.log("open 13");
      const modalRef = this.modalService.open(AlertaDispositivoRemovidoComponent, {
        backdrop: "static",
      });
      modalRef.componentInstance.alerta = embalagem;
    }

    // }, err => console.log(err));
  }

  getAlertCode(status: string) {
    let result: number = 0;

    switch (status) {
      case constants.ALERTS.ANALISYS:
        result = 0;
        break;

      case constants.ALERTS.ABSENT:
        result = 1;
        break;

      case constants.ALERTS.INCORRECT_LOCAL:
        result = 2;
        break;

      case constants.ALERTS.LOW_BATTERY:
        result = 3;
        break;

      case constants.ALERTS.LATE:
        result = 4;
        break;

      case constants.ALERTS.PERMANENCE_TIME:
        result = 5;
        break;

      case constants.ALERTS.NO_SIGNAL:
        result = 6;
        break;

      case constants.ALERTS.MISSING:
        result = 7;
        break;

      case constants.ALERTS.DEVICE_REMOVED:
        result = 13;
        break;

      default:
        result = 0;
    }

    return result;
  }

  getAlertText(code: number): string {
    let result: string = "";

    switch (code) {
      case 1:
        result = "Embalagem Ausente";
        break;

      case 2:
        result = "Embalagem em local incorreto";
        break;

      case 3:
        result = "Embalagem com bateria baixa";
        break;

      case 4:
        result = "Embalagem em viagem";
        break;

      case 5:
        result = "Embalagem com tempo de permanência elevado";
        break;

      case 6:
        result = "Embalagem sem sinal";
        break;

      case 7:
        result = "Embalagem perdida";
        break;

      case 8:
        result = "Dispositivo removido";
        break;
    }

    return result;
  }

  truncateText(str, length): string {
    // console.log(str);
    if(!str) str = "-";
    if (str.length > length) return str.substring(0, length) + "...";
    else return str;
  }
}

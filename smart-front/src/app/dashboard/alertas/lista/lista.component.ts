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
import { constants } from 'environments/constants';
import { AlertaSemSinalComponent } from 'app/shared/modal-alerta/alerta-sem-sinal/alerta-sem-sinal.component';

@Component({
  selector: 'lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  public listOfAlerts: any[] = [];
  public listOfAlertsActualPage: number = -1;

  public familyId;
  public currentState;

  public alertCode = 0;

  alerts: Alert[];
  alert: Alert;
  inscricao: Subscription;

  constructor(private alertsService: AlertsService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal) { }

  ngOnInit() {

    this.inscricao = this.route.params.subscribe((params: any) => {
      this.familyId = params['family_id'];
      this.currentState = params['current_state'];
      this.alertCode = this.getAlertCode(this.currentState);

      console.log(params['current_state']);
      console.log(this.alertCode);

      this.getAlerts();
    });
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  getAlerts() {
    this.alertsService.getAlertsByFamily(this.familyId, this.currentState).subscribe((alerts: any[]) => {
      this.listOfAlerts = alerts.filter(elem => {
        return ((elem.current_state != constants.ALERTS.UNABLE_WITH_SIGNAL) &&
          (elem.current_state != constants.ALERTS.UNABLE_NO_SIGNAL) &&
          (elem.current_state != constants.ALERTS.ANALISYS) &&
          (elem.current_state != constants.ALERTS.TRAVELING) &&
          (elem.current_state != constants.ALERTS.CORRECT_LOCAL));
      });
    }, err => console.log(err));
  }

  open(embalagem, status) {

    // this.alertsService.retrieveAlertByPacking(embalagem, status)
    //   .subscribe(result => {

        console.log(embalagem);
        console.log(status);

        // Análise
        if (status == constants.ALERTS.ANALISYS) {
          const modalRef = this.modalService.open(AlertaAusenteComponent, { backdrop: "static", size: "lg" });
          modalRef.componentInstance.alerta = embalagem;

        // Embalagem Ausente
        } else if (status == constants.ALERTS.ABSENT) {
          const modalRef = this.modalService.open(AlertaAusenteComponent, { backdrop: "static", size: "lg" });
          modalRef.componentInstance.alerta = embalagem;

        // Local Incorreto
        } else if (status == constants.ALERTS.INCORRECT_LOCAL) {
          const modalRef = this.modalService.open(AlertaLocalIncorretoComponent, { backdrop: "static" });
          modalRef.componentInstance.alerta = embalagem;

        // Bateria Baixa
        } else if (status == constants.ALERTS.LOW_BATTERY) {
          const modalRef = this.modalService.open(AlertaBateriaBaixaComponent, { backdrop: "static" });
          modalRef.componentInstance.alerta = embalagem;

        // Embalagem Atrasada
        } else if (status == constants.ALERTS.LATE) {
          const modalRef = this.modalService.open(AlertaEmbalagemAtrasadaComponent, { backdrop: "static" });
          modalRef.componentInstance.alerta = embalagem;

        //Tempo de permanência
        } else if (status == constants.ALERTS.PERMANENCE_TIME) {
          const modalRef = this.modalService.open(AlertaPermanenciaComponent, { backdrop: "static" });
          modalRef.componentInstance.alerta = embalagem;

        //Perdida
        } else if (status == constants.ALERTS.MISSING) {
          const modalRef = this.modalService.open(AlertaEmbalagemPerdidaComponent, { backdrop: "static" });
          modalRef.componentInstance.alerta = embalagem;
        
        //Sem sinal
        } else if (status == constants.ALERTS.NO_SIGNAL) {
          const modalRef = this.modalService.open(AlertaSemSinalComponent, { backdrop: "static" });
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

      default:
        result = 0;
    }

    return result;
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
        result = 'Embalagem sem sinal';
        break;
      
      case 7:
        result = 'Embalagem perdida';
        break;
    }

    return result;
  }
}

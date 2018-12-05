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
  
  public listOfAlerts: any[] = [];
  public listOfAlertsActualPage: number = -1;

  public familyId;
  public currentState;
  
  alerts: Alert[];
  alert: Alert;
  inscricao: Subscription;

  constructor(private alertsService: AlertsService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal) { }

  ngOnInit() {
    
    console.log('listOfAlerts');

    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.familyId = params['family_id'];
        this.currentState = params['current_state'];

        this.getAlerts();
      }
    )
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  getAlerts() {
    this.alertsService.getAlertsByFamily(this.familyId, this.currentState).subscribe(alerts => {
      this.listOfAlerts = alerts;
    },err => console.log(err));
  }

  open(embalagem, status) {

    this.alertsService.retrieveAlertByPacking(embalagem, status)
      .subscribe(result => {

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
        }

      },
        err => {
          console.log(err);
        });
  }

  getAlertCode(status: string){
    let result: number = 0;

    switch (status) {
      
      case 'analise':
        result = 0;
        break;

      case 'analise':
        result = 1;
        break;

      case 'analise':
        result = 2;
        break;

      case 'analise':
        result = 3;
        break;

      case 'analise':
        result = 4;
        break;

      case 'analise':
        result = 5;
        break;

      case 'analise':
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
        result = 'Embalagem perdida';
        break;
    }

    return result;
  }
}

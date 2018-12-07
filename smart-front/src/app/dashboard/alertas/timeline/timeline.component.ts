import { Component, OnInit, Input,OnDestroy, NgZone, ComponentRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from '../../../shared/models/alert';
import { ChatService } from '../../../servicos/teste';
import { ModalModule } from 'ngx-bootstrap/modal'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Pagination } from '../../../shared/models/pagination';
import { AuthenticationService, AlertsService } from '../../../servicos/index.service';
import { constants } from 'environments/constants';

declare var $:any;

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  @ViewChild('autoShownModal') public autoShownModal: ModalDirective;

  public listOfAlerts: any[] = [];  
  public logged_user : any;
  public listOfAlertsActualPage: number = -1;
  public activeModal : any;

  constructor(private alertsService: AlertsService,
    private modalService: NgbModal ) {

  }
  
  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts(){
   
    this.alertsService.getAllAlerts().subscribe(alerts => {
      this.listOfAlerts = alerts.filter(elem => {
        return ((elem.current_state != constants.ALERTS.UNABLE_WITH_SIGNAL) &&
          (elem.current_state != constants.ALERTS.UNABLE_NO_SIGNAL) &&
          (elem.current_state != constants.ALERTS.ANALISYS) &&
          (elem.current_state != constants.ALERTS.TRAVELING) &&
          (elem.current_state != constants.ALERTS.CORRECT_LOCAL));
      });
    }, err => { console.log(err); }); 
  }

  openHelp(content) {
    this.activeModal = this.modalService.open(content,{size: "sm"});
  }

  getAlertCode(status: string){
    let result: number = 0;

    switch (status) {
      
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

  getAlertText(code: string):string {
    let result:string = '';

    switch(code){

      case constants.ALERTS.ABSENT:
        result = 'Embalagem ausente';
        break;

      case constants.ALERTS.INCORRECT_LOCAL:
        result = 'Embalagem em local incorreto';
        break;

      case constants.ALERTS.LOW_BATTERY:
        result = 'Embalagem com bateria baixa';
        break;

      case constants.ALERTS.LATE:
        result = 'Embalagem em viagem';
        break;

      case constants.ALERTS.PERMANENCE_TIME:
        result = 'Embalagem com tempo de permanência elevado';
        break;

      case constants.ALERTS.NO_SIGNAL:
        result = 'Embalagem sem sinal';
        break;

      case constants.ALERTS.MISSING:
        result = 'Embalagem perdida';
        break;
      
      default:
        result = "Não identificado";
    }

    return result;
  }
}

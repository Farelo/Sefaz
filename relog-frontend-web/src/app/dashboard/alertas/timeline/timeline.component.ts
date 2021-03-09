import { Component, OnInit, Input,OnDestroy, NgZone, ComponentRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from '../../../shared/models/alert'; 
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
  public settings;

  constructor(private alertsService: AlertsService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal ) {

  }
  
  ngOnInit() {

    this.getSettings();
    this.loadAlerts();
  }

  loadAlerts(){
   
    this.alertsService.getAllAlerts().subscribe(alerts => {
      this.listOfAlerts = alerts.filter(elem => {
        return ((elem.current_state !== constants.ALERTS.UNABLE_WITH_SIGNAL) &&
          (elem.current_state !== constants.ALERTS.UNABLE_NO_SIGNAL) &&
          (elem.current_state !== constants.ALERTS.ANALISYS) &&
          (elem.current_state !== constants.ALERTS.TRAVELING) &&
          (elem.current_state !== constants.ALERTS.CORRECT_LOCAL));
      });

      // console.log('this.settings.enable_viagem_perdida: ' + JSON.stringify(this.listOfAlerts));
      // console.log('this.settings: ' + JSON.stringify(this.settings));

      this.listOfAlerts = this.listOfAlerts.filter(elem => {
        
        //console.log('');
        // console.log('elem.current_state: ' + elem.current_state);

        return ((constants.ALERTS.ABSENT == elem.current_state) && this.settings.enable_viagem_perdida)       //1
        || ((constants.ALERTS.INCORRECT_LOCAL == elem.current_state) && this.settings.enable_local_incorreto) //2
        || (constants.ALERTS.LOW_BATTERY == elem.current_state)                                               //3
        || ((constants.ALERTS.LATE == elem.current_state) && this.settings.enable_viagem_atrasada)            //4
        || ((constants.ALERTS.PERMANENCE_TIME == elem.current_state))                                         //5
        || ((constants.ALERTS.NO_SIGNAL == elem.current_state) && this.settings.enable_sem_sinal)             //6
        || ((constants.ALERTS.MISSING == elem.current_state) && this.settings.enable_perdida)
        || ((constants.ALERTS.DEVICE_REMOVED == elem.current_state))        //7
      });
      
      // console.log(this.listOfAlerts);
      
    }, err => { console.log(err); }); 
  }

  /**
   * Recupera a configuração dos alertas
   */
  getSettings() {

    this.settings = this.authenticationService.currentSettings();
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

      case constants.ALERTS.DEVICE_REMOVED:
        result = 13;
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
 
      case constants.ALERTS.DEVICE_REMOVED:
        result = 'Dispositivo removido';
        break;  

      default:
        result = "Não identificado";
    }

    return result;
  }
}

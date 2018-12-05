import { Component, OnInit, Input,OnDestroy, NgZone, ComponentRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from '../../../shared/models/alert';
import { ChatService } from '../../../servicos/teste';
import { ModalModule } from 'ngx-bootstrap/modal'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Pagination } from '../../../shared/models/pagination';
import { AuthenticationService, AlertsService } from '../../../servicos/index.service';
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
      this.listOfAlerts = alerts;
    }, err => { console.log(err); }); 
  }

  openHelp(content) {
    this.activeModal = this.modalService.open(content,{size: "sm"});
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

  getAlertText(code: string):string {
    let result:string = '';

    switch(code){

      case 'analise':
        result = 'Em análise';
        break;

      case 'analise':
        result = 'Embalagem Ausente';
        break;

      case 'analise':
        result = 'Embalagem em local incorreto';
        break;

      case 'analise':
        result = 'Embalagem com bateria baixa';
        break;

      case 'analise':
        result = 'Embalagem em viagem';
        break;

      case 'analise':
        result = 'Embalagem com tempo de permanência elevado';
        break;

      case 'analise':
        result = 'Embalagem perdida';
        break;
      
      default:
        result = "Não identificado";
    }

    return result;
  }
}

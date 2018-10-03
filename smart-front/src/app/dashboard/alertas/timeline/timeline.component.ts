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

  @ViewChild('autoShownModal') public autoShownModal:ModalDirective;
  public data: Pagination = new Pagination({meta: {page : 1}});
  public isModalShown:boolean = false;
  public grande = false;
  public logged_user : any;
  private telaGrande: boolean = false;
  altura: any;
  largura: any;
  private aparecer: boolean = false;
  closeResult: string;
  verModal: boolean = true;
  public activeModal : any;

  constructor(
    private AlertsService: AlertsService,
    private modalService: NgbModal,
    private chatService: ChatService,
    private ngZone:NgZone,
    private modalTop: ModalModule,
    private auth: AuthenticationService ) {

    window.onresize = (e) => {
      ngZone.run(() => {
          this.largura = window.innerWidth;
          this.altura = window.innerHeight;
      });

      if(this.largura > 1200)
        this.telaGrande = true;
      else
        this.telaGrande = false;
    };

    ngZone.run(() => {
      this.largura = window.innerWidth;
      this.altura = window.innerHeight;
    });

    if(this.largura > 1200)
      this.telaGrande = true;
    else 
      this.telaGrande = false;

    //catch the user information when the users are supplier or logistc 
    let user = this.auth.currentUser();
    this.logged_user = (user.supplier ? user.supplier._id : ( 
      user.official_supplier ? user.official_supplier :( 
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine
   
  }

  loadAlerts(){
   
    if (this.logged_user instanceof  Array ){
      this.AlertsService.getAlertsLogistic(20, this.data.meta.page, this.logged_user)
        .subscribe(alerts => this.data = alerts,
          err => { console.log(err); });

    }else{
      this.AlertsService.getAlerts(16, this.data.meta.page, this.logged_user)
        .subscribe(alerts => {
          this.data = alerts;
        
          // this.data.data.push({
          //   "_id": {
          //     "supplier": "5ac188ed8431ce000f973d93",
          //     "project": "5ac180a28431ce000f973d8a",
          //     "code": "ISI",
          //     "status": 6
          //   },
          //   "quantity": 2,
          //   "packing": {
          //     "_id": "5b3ba2fe6fc7e02f3077694d",
          //     "code": "ISI",
          //     "type": "ISI-teste",
          //     "weigth": 1,
          //     "width": 1,
          //     "heigth": 1,
          //     "length": 1,
          //     "capacity": 1,
          //     "problem": false,
          //     "missing": true,
          //     "traveling": false,
          //     "serial": "001",
          //     "tag": "5b3ba2726fc7e02f3077694b",
          //     "code_tag": "5040223",
          //     "supplier": "5ac188ed8431ce000f973d93",
          //     "project": "5ac180a28431ce000f973d8a",
          //     "hashPacking": "5ac188ed8431ce000f973d93ISI",
          //     "routes": [
          //       "5b58b8079d2b2539389b21ed"
          //     ],
          //     "__v": 0,
          //     "position": {
          //       "latitude": -8.0476,
          //       "longitude": -34.8774,
          //       "accuracy": 70,
          //       "date": 1537977602
          //     },
          //     "temperature": 23,
          //     "lastCommunication": 1537977602,
          //     "battery": 71.3235,
          //     "permanence": {
          //       "amount_days": 0,
          //       "date": 0,
          //       "date_exceeded": 0,
          //       "amount_days_exceeded": 0,
          //       "time_exceeded": false
          //     },
          //     "status": "MISSING",
          //     "trip": {
          //       "time_exceeded": false,
          //       "date": 1533934978752,
          //       "time_countdown": 225790652,
          //       "date_late": 1533935048223,
          //       "time_late": 59552
          //     },
          //     "packing_missing": {
          //       "date": 1534160769406,
          //       "time_countdown": 3821026237
          //     },
          //     "status_pt": "NORMAL"
          //   },
          //   "supplier": {
          //     "_id": "5ac188ed8431ce000f973d93",
          //     "name": "MAHLE BEHR GERE",
          //     "duns": "\t 899142806",
          //     "plant": "5ac188ed8431ce000f973d92",
          //     "cnpj": "",
          //     "profile": "5ac188ed8431ce000f973d91",
          //     "__v": 0
          //   },
          //   "project": {
          //     "_id": "5ac180a28431ce000f973d8a",
          //     "name": "Piloto1",
          //     "__v": 0
          //   },
          //   "status": 6,
          //   "hash": "5ac188ed8431ce000f973d93ISI"
          // });
        },
          err => { console.log(err); });
    }
  }

  ngOnInit() {
      this.loadAlerts();
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadAlerts();
  }

  open(content) {
    this.modalService.open(content);
  }
  openHelp(content) {
    this.activeModal = this.modalService.open(content,{size: "sm"});
  }

  getAlertText(code: number):string {
    let result:string = '';

    switch(code){
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

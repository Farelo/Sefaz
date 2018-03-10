import { Component, OnInit, Input,OnDestroy, NgZone, ComponentRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../../servicos/alerts.service';
import { Alert } from '../../../shared/models/alert';
import { ChatService }       from '../../../servicos/teste';
import { ModalModule } from 'ngx-bootstrap/modal'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Pagination } from '../../../shared/models/pagination';
import { AuthenticationService } from '../../../servicos/auth.service';
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
      private auth: AuthenticationService, 
  ) {
    window.onresize = (e) => {
        ngZone.run(() => {
            this.largura = window.innerWidth;
            this.altura = window.innerHeight;
        });
        if(this.largura > 1200){
          this.telaGrande = true;
        } else {
          this.telaGrande = false;
        }
    };
    ngZone.run(() => {
        this.largura = window.innerWidth;
        this.altura = window.innerHeight;
    });
    if(this.largura > 1200){
      this.telaGrande = true;
    } else {
      this.telaGrande = false;
    }

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
          err => {
            console.log(err);
          });
    }else{
      this.AlertsService.getAlerts(16, this.data.meta.page, this.logged_user)
        .subscribe(alerts => { console.log(alerts); this.data = alerts },
          err => {
            console.log(err);
        });
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

}

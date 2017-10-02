import { Component, OnInit, Input,OnDestroy, NgZone, ComponentRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../../../servicos/alerts.service';
import { Alert } from '../../../../shared/models/alert';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Pagination } from '../../../../shared/models/pagination';
import { AuthenticationService } from '../../../../servicos/auth.service';
declare var $:any;

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [NgbPopoverConfig]
})
export class TimelineComponent implements OnInit {

  @ViewChild('autoShownModal') public autoShownModal:ModalDirective;
  public data: Pagination = new Pagination({meta: {page : 1}});
  public isModalShown:boolean = false;
  public showModal():void { this.isModalShown = true; }
  public hideModal():void { this.autoShownModal.hide(); }
  public onHidden():void { this.isModalShown = false; }
  public grande = false;


  private telaGrande: boolean = false;
  altura: any;
  largura: any;
  private aparecer: boolean = false;
  closeResult: string;
  verModal: boolean = true;

  constructor(
      private AlertsService: AlertsService,
      private modalService: NgbModal,
      private auth: AuthenticationService,
      private config: NgbPopoverConfig,
      private ngZone:NgZone,
      private modalTop: ModalModule
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
  }


  loadAlerts(){

    let id = (this.auth.currentUser().supplier ? this.auth.currentUser().supplier._id : this.auth.currentUser().official_supplier);

    this.AlertsService.getAlerts(20,this.data.meta.page,id)
      .subscribe(alerts => this.data = alerts,
      err => {
        console.log(err);
      });
  }

  ngOnInit() {
      this.loadAlerts();
      this.showModal();
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadAlerts();
  }

  open(content) {
    this.modalService.open(content);
  }

}

import { Component, OnInit, Input,OnDestroy, NgZone, ComponentRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../../servicos/alerts.service';
import { Alert } from '../../../shared/models/alert';
import { ChatService }       from '../../../servicos/teste';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal'
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var $:any;

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [NgbPopoverConfig]
})
export class TimelineComponent implements OnInit,OnDestroy {

  @ViewChild('autoShownModal') public autoShownModal:ModalDirective;
  public isModalShown:boolean = false;

  public showModal():void {
    this.isModalShown = true;
  }

  public hideModal():void {
    this.autoShownModal.hide();
  }

  public onHidden():void {
    this.isModalShown = false;
  }


  alerts;
  alert: Alert;
  connection;
  message;
  private telaGrande: boolean = false;
  altura: any;
  largura: any;
  private aparecer: boolean = false;
  closeResult: string;
  verModal: boolean = true;
  testes: any[] = [
    {codigo: '000000001', rack: 'Rack Metálico', safe: 'SafeSIM', numero: '1'},
    {codigo: '000000002', rack: 'Rack Metálico', safe: 'SafeSIM', numero: '2'},
    {codigo: '000000003', rack: 'Rack Metálico', safe: 'SafeSIM', numero: '3'},
    {codigo: '000000004', rack: 'Rack Metálico', safe: 'SafeSIM', numero: '4'},
    {codigo: '000000005', rack: 'Rack Metálico', safe: 'SafeSIM', numero: '5'},
    {codigo: '000000006', rack: 'Rack Metálico', safe: 'SafeSIM', numero: '6'},
    {codigo: '000000007', rack: 'Rack Metálico', safe: 'SafeSIM', numero: '7'},
    {codigo: '000000008', rack: 'Rack Metálico', safe: 'SafeSIM', numero: '8'},
    {codigo: '000000009', rack: 'Rack Metálico', safe: 'SafeSIM', numero: '9'}
  ];

  constructor(
      private AlertsService: AlertsService,
      private modalService: NgbModal,
      private chatService: ChatService,
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
  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  loadAlerts(){
    this.AlertsService.getAlertsPagination(10,1)
      .subscribe(alerts => {this.alerts = alerts;
      console.log(this.alerts );},
      err => {
        console.log(err);
      });
    this.connection = this.chatService.getMessages().subscribe(message => {
      this.alerts = message;
      this.alerts = this.alerts.text;
    });
  }

  ngOnInit() {
      this.loadAlerts();
      this.showModal();
  }
  open(content) {
    this.modalService.open(content);
  }

}

import { Component, OnInit, Input,OnDestroy, NgZone, ComponentRef, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../../servicos/alerts.service';
import { Alert } from '../../../shared/models/alert';
import { ChatService }       from '../../../servicos/teste';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Pagination } from '../../../shared/models/pagination';
declare var $:any;

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [NgbPopoverConfig]
})
export class TimelineComponent implements OnInit {

  @ViewChild('autoShownModal') public autoShownModal:ModalDirective;

  public isModalShown:boolean = false;
  public showModal():void { this.isModalShown = true; }
  public hideModal():void { this.autoShownModal.hide(); }
  public onHidden():void { this.isModalShown = false; }

  public alerts : any;
  alert: Alert;
  connection;
  message;
  private telaGrande: boolean = false;
  altura: any;
  largura: any;
  private aparecer: boolean = false;
  closeResult: string;
  verModal: boolean = true;
  // testes: any[] = [
  //   {codigo: '000000001', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '1', status: 'A'},
  //   {codigo: '000000002', rack: 'Rack de Madeira', safe: 'Fornecedor 1', numero: '2', status: 'B'},
  //   {codigo: '000000003', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '3',  status: 'C',},
  //   {codigo: '000000004', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '4',  status: 'D'},
  //   {codigo: '000000005', rack: 'Rack de Madeira', safe: 'Fornecedor 1', numero: '5',  status: 'E'},
  //   {codigo: '000000006', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '6',  status: 'F'},
  //   {codigo: '000000007', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '7',  status: 'A'},
  //   {codigo: '000000008', rack: 'Rack de Madeira', safe: 'Fornecedor 1', numero: '8',  status: 'B'},
  //   {codigo: '000000009', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '9',  status: 'C'},
  //   {codigo: '000000010', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '1', status: 'A'},
  //   {codigo: '000000011', rack: 'Rack de Madeira', safe: 'Fornecedor 1', numero: '2', status: 'B'},
  //   {codigo: '000000013', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '3',  status: 'C',},
  //   {codigo: '000000014', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '4',  status: 'D'},
  //   {codigo: '000000015', rack: 'Rack de Madeira', safe: 'Fornecedor 1', numero: '5',  status: 'E'},
  //   {codigo: '000000016', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '6',  status: 'F'},
  //   {codigo: '000000017', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '7',  status: 'A'},
  //   {codigo: '000000018', rack: 'Rack de Madeira', safe: 'Fornecedor 1', numero: '8',  status: 'B'},
  //   {codigo: '000000019', rack: 'Rack Metálico', safe: 'Fornecedor 1', numero: '9',  status: 'C'}
  // ];

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

  // ngOnDestroy() {
  //   this.connection.unsubscribe();
  // }

  // sendMessage() {
  //   this.chatService.sendMessage(this.message);
  //   this.message = '';
  // }

  loadAlerts(){

    // this.connection = this.chatService.getMessages().subscribe(message => {
    //   this.alerts = message;
    //   this.alerts = this.alerts.text;
    // });

    this.AlertsService.getAlerts(20,1)
      .subscribe(alerts => {this.alerts = alerts;
      console.log(this.alerts);},
      err => {
        console.log(err);
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

import { Component, OnInit, Input,OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../../servicos/alerts.service';
import { Alert } from '../../../shared/models/alert';
import { ChatService }       from '../../../servicos/teste';


@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit,OnDestroy {

  // embalagens: any[];
  //   embalagem: any;
  //   constructor(
  //     private embalagensService: EmbalagensService,
  //     private modalService: NgbModal
  //   ) { }
  //
  //   ngOnInit() {
  //     this.embalagens = this.embalagensService.getEmbalagens();
  //   }
  //   open(embalagem) {
  //     const modalRef = this.modalService.open(ModalComponent);
  //     modalRef.componentInstance.embalagem = embalagem;
  //   }
  // }

  alerts;
  alert: Alert;
  connection;
  message;

  constructor(
      private AlertsService: AlertsService,
      private modalService: NgbModal,
      private chatService: ChatService
  ) { }


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

    }

    );
  }

  ngOnInit() {
      this.loadAlerts();
  }

}

import { Component, OnInit, Input,OnDestroy, NgZone, ComponentRef } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../../servicos/alerts.service';
import { Alert } from '../../../shared/models/alert';
import { ChatService }       from '../../../servicos/teste';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalLegComponent } from '../../../shared/modal-leg/modal-leg.component';
// import { HttpModule, JsonpModule } from '@angular/http';
// import { Http, Response }          from '@angular/http';


@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [NgbPopoverConfig]
})
export class TimelineComponent implements OnInit,OnDestroy {


  alerts;
  alert: Alert;
  connection;
  message;
  private telaGrande: boolean = false;
  altura: any;
  largura: any;
  private aparecer: boolean = false;
  closeResult: string;

  constructor(
      private AlertsService: AlertsService,
      private modalService: NgbModal,
      private chatService: ChatService,
      private config: NgbPopoverConfig,
      private ngZone:NgZone
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

    }

    );
  }

  ngOnInit() {
      this.loadAlerts();
      // this.modalService.open(ChildComponent);
  }
  open(content) {
    this.modalService.open(content);
  }
}

@Component({
selector: 'legendas',
template: `
<button>Estou num celular</button>
`
})

export class ChildComponent {}

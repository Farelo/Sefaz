import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../servicos/alerts.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { Alert } from '../../shared/models/alert';
import { EmbalagensService } from '../../servicos/embalagens.service';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  embalagens: any[];
    embalagem: any;
    constructor(
      private embalagensService: EmbalagensService,
      private modalService: NgbModal
    ) { }

    ngOnInit() {
      this.embalagens = this.embalagensService.getEmbalagens();
    }
    open(embalagem) {
      const modalRef = this.modalService.open(ModalComponent);
      modalRef.componentInstance.embalagem = embalagem;
    }
  }

  /*alerts: Alert[];
  alert: Alert;

  constructor(
      private AlertsService: AlertsService,
      private modalService: NgbModal
  ) { }

  loadAlerts(){
    this.AlertsService.getAlertsPagination(10,1)
      .subscribe(alerts => {this.alerts = alerts;
      console.log(this.alerts );},
      err => {
        console.log(err);
      });
  }

  open(packing) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.embalagem = packing;
  }

  ngOnInit() {
      this.loadAlerts();
  }

}*/

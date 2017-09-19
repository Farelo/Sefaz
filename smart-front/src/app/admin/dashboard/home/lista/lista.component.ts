import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AlertaModalComponent } from '../../../../shared/modal-alerta/alerta.component';
import { AlertsService } from '../../../../servicos/alerts.service';
import { Alert } from '../../../../shared/models/alert';

@Component({
  selector: 'lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  // embalagens: any[]
  // embalagem: any;
  // lista: any[]
  alerts: Alert[];
  alert: Alert;
  inscricao: Subscription;

  constructor(
    private AlertsService: AlertsService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal

  ) { }

  ngOnInit() {

    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params ['hashing'];
        let status = params ['status'];
        this.AlertsService.getAlertsPaginationByHashing(10,1,id,status)
          .subscribe(alerts => {console.log(alerts);this.alerts = alerts},
          err => {
            console.log(err);
          });
      }
    )
  }

  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }

  open(embalagem,status) {

    this.AlertsService.retrieveAlertByPacking(embalagem,status)
      .subscribe(result => {

          const modalRef = this.modalService.open(AlertaModalComponent);
          modalRef.componentInstance.alerta = result;

      },
      err => {
        console.log(err);
      });

  }

}

import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { PositionModalComponent } from '../../../shared/modal/alerta/position/alerta.component';
import { MissingModalComponent } from '../../../shared/modal/alerta/missing/alerta.component';
import { AlertsService } from '../../../servicos/alerts.service';
import { Alert } from '../../../shared/models/alert';

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
          .subscribe(alerts => this.alerts = alerts,
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

    this.AlertsService.retrieveAlertByPacking(embalagem)
      .subscribe(packing => {
        console.log(packing);
        if(status === "01"){
          const modalRef = this.modalService.open(PositionModalComponent);
          modalRef.componentInstance.alerta = packing;
        }else{
          const modalRef = this.modalService.open(MissingModalComponent);
          modalRef.componentInstance.alerta = packing;

        }

      },
      err => {
        console.log(err);
      });

  }

}

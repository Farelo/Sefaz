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

    this.AlertsService.retrieveAlertByPacking(embalagem,status)
      .subscribe(result => {

          let time: number = parseInt(result.data.packing.permanence.amount_days);
          parseInt((time / 1000).toString())
          let seconds: string | number = (parseInt((time / 1000).toString()) % 60);
          let minutes: string | number = (parseInt((time / (1000 * 60)).toString()) % 60);
          let hours: string | number = (parseInt((time / (1000 * 60 * 60)).toString()) % 24);

          hours = (hours < 10) ? "0" + hours : hours;
          minutes = (minutes < 10) ? "0" + minutes : minutes;
          seconds = (seconds < 10) ? "0" + seconds : seconds;

          result.data.packing.permanence.amount_days = hours + " Horas e " + minutes + " Minutos"  ;

          const modalRef = this.modalService.open(PositionModalComponent);
          modalRef.componentInstance.alerta = result;
        // }else{
        //   const modalRef = this.modalService.open(MissingModalComponent);
        //   modalRef.componentInstance.alerta = packing;
        //
        // }

      },
      err => {
        console.log(err);
      });

  }

}

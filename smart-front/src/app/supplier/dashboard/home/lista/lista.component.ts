import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AlertaModalComponent } from '../../../../shared/modal-alerta/alerta.component';
import { AlertsService } from '../../../../servicos/alerts.service';
import { Alert } from '../../../../shared/models/alert';
import { Pagination } from '../../../../shared/models/pagination';
import { AuthenticationService } from '../../../../servicos/auth.service';

@Component({
  selector: 'lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  alerts: Alert[];
  public code;
  public supplier;
  public project;
  public status;
  alert: Alert;
  inscricao: Subscription;

  constructor(
    private AlertsService: AlertsService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private modalService: NgbModal

  ) { }

  ngOnInit() {

    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        this.code = params ['code'];
        this.status = params ['status'];
        this.project = params ['project'];
        this.supplier = params ['supplier'];
        this.getAlerts();
      }
    )
  }

  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }

  getAlerts(){
    this.AlertsService.getAlertsPaginationByHashing(10,this.data.meta.page,this.code,this.project,this.supplier,this.status,this.auth.currentUser().supplier._id)
      .subscribe(alerts => this.data = alerts,
      err => {
        console.log(err);
      });
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

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.getAlerts();
  }

}

import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AlertaModalComponent } from '../../../shared/modal-alerta/alerta.component';
import { AlertsService } from '../../../servicos/index.service';
import { Alert } from '../../../shared/models/alert';
import { Pagination } from '../../../shared/models/pagination';

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
    private modalService: NgbModal ) { }

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
    this.AlertsService.getAlertsPaginationByHashing(10,this.data.meta.page,this.code,this.project,this.supplier,this.status)
      .subscribe(alerts => {
        this.data = alerts;
      },
      err => {
        console.log(err);
      });
  }

  open(embalagem, status) {

    this.AlertsService.retrieveAlertByPacking(embalagem, status)
      .subscribe(result => {
       
        if (status == 1 ){
          const modalRef = this.modalService.open(AlertaModalComponent, { backdrop: "static", size: "lg" });
          modalRef.componentInstance.alerta = result;

        }else{
          const modalRef = this.modalService.open(AlertaModalComponent, { backdrop: "static" });
          modalRef.componentInstance.alerta = result;
        }

      }, err => { console.log(err); });
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.getAlerts();
  }

  getAlertText(code: number): string {
    let result: string = '';

    switch (code) {
      case 1:
        result = 'Embalagem Ausente';
        break;

      case 2:
        result = 'Embalagem em local incorreto';
        break;

      case 3:
        result = 'Embalagem com bateria baixa';
        break;

      case 4:
        result = 'Embalagem em viagem';
        break;

      case 5:
        result = 'Embalagem com tempo de permanência elevado';
        break;
    }

    return result;
  }
}

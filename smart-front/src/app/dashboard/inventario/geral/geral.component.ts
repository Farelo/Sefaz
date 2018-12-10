import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InventoryLogisticService, AuthenticationService, PackingService, SuppliersService, InventoryService, ReportsService } from '../../../servicos/index.service';
import { Pagination } from '../../../shared/models/pagination';
import { ModalInvComponent } from '../../../shared/modal-inv/modal-inv.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-geral',
  templateUrl: './geral.component.html',
  styleUrls: ['./geral.component.css']
})
export class GeralComponent implements OnInit {

  //dados da tabela
  public listOfGeneral: any[] = [];
  public auxListOfGeneral: any[] = [];

  //paginação
  public listOfGeneralActualPage: number = -1;

  public isCollapsed = false;

  constructor(private reportService: ReportsService,
    private modalService: NgbModal,
    private auth: AuthenticationService) {

  }

  ngOnInit() {

    this.getGeneral();
  }

  getGeneral() {

    this.reportService.getGeneral().subscribe(result => {
      this.listOfGeneral = result;
      this.auxListOfGeneral = result;

    },err => console.log(err));
  }

  open(packing) {
    const modalRef = this.modalService.open(ModalInvComponent);
    modalRef.componentInstance.packing = packing;
  }
  
}

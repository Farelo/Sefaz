import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InventoryLogisticService, AuthenticationService, PackingService, SuppliersService, InventoryService } from '../../../servicos/index.service';
import { Pagination } from '../../../shared/models/pagination';
import { ModalInvComponent } from '../../../shared/modal-inv/modal-inv.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-geral',
  templateUrl: './geral.component.html',
  styleUrls: ['./geral.component.css']
})
export class GeralComponent implements OnInit {

  public logged_user: any;
  public suppliers: any;
  public general: Pagination = new Pagination({ meta: { page: 1 } });

  public isCollapsed = false;
  constructor(
    private inventoryLogisticService: InventoryLogisticService,
    private inventoryService: InventoryService,
    private modalService: NgbModal,
    private auth: AuthenticationService,
    
  ) {

    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine
  }

  ngOnInit() {
    this.loadTableHeaders();
    this.generalInventory();
  }

  public headers: any = [];

  loadTableHeaders(){
    this.headers.push({name: 'Equipamento', label: 'code', status: false});
    this.headers.push({ name: 'Projeto', label: 'project', status: false });
    this.headers.push({ name: 'Descrição', label: 'description', status: false });
    this.headers.push({ name: 'Fornecedor', label: 'supplier', status: false });
    this.headers.push({ name: 'Quantidade', label: 'quantity', status: false });

    console.log('this.headers: ' + JSON.stringify(this.headers));
  }

  headerClick(item: any){
    
    let index = this.headers.indexOf(item);
    
    //atualizar status em todos
    if(item.status == true) {
      this.headers[index].status = false;
      
    }else{
      this.headers.map(elem => elem.status = false);
      this.headers[index].status = true;
    }

    this.orderTable();

    console.log('item: ' + JSON.stringify(item), ' index: ' + this.headers.indexOf(item)); 
  }

  //TODO
  orderTable(){

  }

  generalInventory() {
    if (this.logged_user instanceof Array) {
      this.inventoryLogisticService.getInventoryGeneral(10, this.general.meta.page, this.logged_user).subscribe(result => this.general = result, err => { console.log(err) });
    } else {
      this.inventoryService.getInventoryGeneral(10, this.general.meta.page, this.logged_user).subscribe(result => this.general = result, err => { console.log(err) });
    }
  }

  open(packing) {
    const modalRef = this.modalService.open(ModalInvComponent);
    modalRef.componentInstance.packing = packing;
  }
  
}

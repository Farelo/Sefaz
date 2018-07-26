import { Component, OnInit } from '@angular/core';
import { GC16Service, AuthenticationService, PackingService, InventoryLogisticService, InventoryService } from '../../servicos/index.service';
import { Pagination } from '../../shared/models/pagination';
import { ModalDeleteComponent } from '../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gc16',
  templateUrl: './gc16.component.html',
  styleUrls: ['./gc16.component.css']
})
export class Gc16Component implements OnInit {

  public logged_user: any;
  public data: Pagination = new Pagination({meta: {page : 1}});
  public equipamentSearch = "";
  public packings: any[];
 
  constructor(
    private packingService: PackingService,
    private inventoryLogisticService: InventoryLogisticService,
    private inventoryService: InventoryService,
    private GC16Service: GC16Service,
    private modalService: NgbModal,
    private auth: AuthenticationService) { 

    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine
  }

  ngOnInit() {
    this.loadPackings();
    this.loadGC16();
  }


  loadGC16() {
    this.GC16Service
      .getGC16sPagination(10, this.data.meta.page, this.equipamentSearch)
      .subscribe(result => {
         this.data = result;
       },err => {  console.log(err)});
  }

  loadPackings() {
    console.log('loadPackings');

    if (this.logged_user instanceof Array) {
      this.packingService.getPackingsDistinctsByLogistic(this.logged_user).subscribe(result => {
        this.packings = result.data;
      }, err => { console.log(err) });

    } else if (this.logged_user) {
      this.packingService.getPackingsDistinctsBySupplier(this.logged_user).subscribe(result => {
        this.packings = result.data;
      }, err => { console.log(err) });

    } else {
      this.packingService.getPackingsDistincts().subscribe(result => {
        this.packings = result.data;
      }, err => { console.log(err) });
    }
  }

  equipamentChanged(){
    if (this.equipamentSearch == null) this.equipamentSearch = "";
    this.loadGC16();
  }

  //refazer isso daqui, depende de muitas coisas para ser realizada a alteração
  removeGC16(object: any):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = object;
    modalRef.componentInstance.type = "gc16";

    modalRef.result.then((result) => {
      if(result === "remove") this.loadGC16();
    });
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadGC16();
  }

}

import { Component, OnInit } from '@angular/core';
import { GC16Service, AuthenticationService, PackingService, InventoryLogisticService, InventoryService } from '../../servicos/index.service'; 
import { ModalDeleteComponent } from '../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gc16',
  templateUrl: './gc16.component.html',
  styleUrls: ['./gc16.component.css']
})
export class Gc16Component implements OnInit {

  public actualPage: number = -1;
  public logged_user: any;
  public mListOfGC16: any[] = [];
  public equipamentSearch = "";
  public packings: any[];
 
  constructor( 
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
    this.loadGC16();
  }

  loadGC16() {
    this.GC16Service.getAllGC16().subscribe(result => {
      this.mListOfGC16 = result;
    },err => {  console.log(err)});
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


}

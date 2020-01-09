import { Component, OnInit } from '@angular/core';
import { GC16Service, AuthenticationService, PackingService, InventoryLogisticService, InventoryService } from '../../servicos/index.service'; 
import { ModalDeleteComponent } from '../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

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
 
  constructor( public translate: TranslateService,
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

  removeGC16(gc16: any):void{

    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = gc16;
    modalRef.componentInstance.mType = "BPLINE";

    modalRef.result.then((result) => {
      this.loadGC16();
    });
  }


}

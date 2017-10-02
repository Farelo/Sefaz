import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { InventoryLogisticService } from '../../../servicos/inventory_logistic.service';
import { SuppliersService } from '../../../servicos/suppliers.service';
import { Pagination } from '../../../shared/models/pagination';
import { Alert } from '../../../shared/models/alert';
import { ModalInvComponent } from '../../../shared/modal-inv/modal-inv.component';
import { LayerModalComponent } from '../../../shared/modal-packing/layer.component';
import { AuthenticationService } from '../../../servicos/auth.service';
declare var $:any;

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  public array : any;
  public suppliers: any;
  public name_supplier: any;
  public escolhaGeral: any = 'GERAL';
  public escolhaEquipamento =  "";
  public verModal: boolean = true;
  public escolhas: any[] = [
    {name: 'GERAL'},
    {name: 'EQUIPAMENTO'}];
  public general: Pagination = new Pagination({meta: {page : 1}});
  public supplier: Pagination = new Pagination({meta: {page : 1}});
  public battery: Pagination = new Pagination({meta: {page : 1}});
  public permanence: Pagination = new Pagination({meta: {page : 1}});
  public quantity: Pagination = new Pagination({meta: {page : 1}});
  public general_equipament: Pagination = new Pagination({meta: {page : 1}});
  public supplierSearch  = "";
  public batterySearch  = "";
  public quantitySearch  = "";
  public permanenceSearchEquipamento  = "";
  public permanenceSearchSerial  = "";
  public generalEquipamentSearch  = "";
  public serial = false;
  public activeModal : any;
  constructor(

    private inventoryLogisticService: InventoryLogisticService,
    private suppliersService: SuppliersService,
    private router: Router,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private modalActive: NgbActiveModal,
    private ref: ChangeDetectorRef,
  ) { }



  changeSelect(event){
    if(event === "Bateria"){
        this.batteryInventory();
    }else if(event === "Geral"){
        this.generalInventoryEquipament();
    }
  }

  tamanhoSelect(){
      $(window).resize(function(){
      var largura = $('.select2-container').width();
      var quadrado = $('.select2-container--open');
      quadrado.css({'width':'largura'});
    });
  }


// Bateria inventario  ----------------------------------
  batteryInventory(){

      this.inventoryLogisticService.getInventoryBattery(10,this.battery.meta.page,this.batterySearch,this.array).subscribe(result => this.battery = result, err => {console.log(err)});
  }

  generalInventoryEquipament(){
      this.inventoryLogisticService.getInventoryGeneralPackings(10,this.general_equipament.meta.page,this.generalEquipamentSearch,this.array).subscribe(result => {this.general_equipament = result; console.log(result)}, err => {console.log(err)});
  }

  quantityInventory(){
    if(this.quantitySearch){
        this.inventoryLogisticService.getInventoryQuantity(10,this.quantity.meta.page,this.quantitySearch,this.array).subscribe(result => {console.log(result);this.quantity = result}, err => {console.log(err)});
    }
  }

  generalInventory(){
      this.inventoryLogisticService.getInventoryGeneral(10,this.general.meta.page,this.array).subscribe(result => this.general = result, err => {console.log(err)});
  }

  choiced(event:any){
    if(event === "FORNECEDOR"){

    }
  }

  permanenceInventory(){
    if(this.permanenceSearchEquipamento && this.permanenceSearchSerial ){
      this.serial = true;
      this.inventoryLogisticService.getInventoryPackingHistoric(10,this.permanence.meta.page,this.permanenceSearchSerial,this.permanenceSearchEquipamento,this.array).subscribe(result => {
        this.permanence  = result;
       }, err => {console.log(err)});
    }else if(this.permanenceSearchEquipamento){
      this.serial = false;
      this.inventoryLogisticService.getInventoryPermanence(10,this.permanence.meta.page,this.permanenceSearchEquipamento,this.array).subscribe(result => this.permanence = result, err => {console.log(err)});
    }
  }

  open(packing) {
    const modalRef = this.modalService.open(ModalInvComponent);
    modalRef.componentInstance.packing = packing;
  }

  openLayer(packing) {
    const modalRef = this.modalService.open(LayerModalComponent);
    modalRef.componentInstance.packing = packing;
  }

  ngOnInit() {
    this.array = (this.auth.currentUser().logistic ? this.auth.currentUser().logistic.suppliers : this.auth.currentUser().official_logistic.suppliers);
    this.generalInventory();
    this.tamanhoSelect();
  }


  openHelp(content) {
   this.activeModal = this.modalService.open(content);
 }



}

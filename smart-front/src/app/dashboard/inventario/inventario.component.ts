import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { InventoryService } from '../../servicos/inventory.service';
import { SuppliersService } from '../../servicos/suppliers.service';
import { Pagination } from '../../shared/models/pagination';
import { Alert } from '../../shared/models/alert';
import { ModalInvComponent } from '../../shared/modal-inv/modal-inv.component';
declare var $:any;

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  public embalagens: any[];
  public suppliers: any;
  public name_supplier: any;
  public escolhaGeral: any = 'GERAL';
  public escolhaEquipamento =  "";
  public verModal: boolean = true;
  public escolhas: any[] = [
    {nome: 'GERAL', numero: '01'},
    {nome: 'EQUIPAMENTO', numero: '02'},
    {nome: 'FORNECEDOR', numero: '03'}]
  public general: Pagination = new Pagination({meta: {page : 1}});
  public supplier: Pagination = new Pagination({meta: {page : 1}});
  public battery: Pagination = new Pagination({meta: {page : 1}});
  public permanence: Pagination = new Pagination({meta: {page : 1}});
  public quantity: Pagination = new Pagination({meta: {page : 1}});
  public supplierSearch  = "";
  public batterySearch  = "";
  public quantitySearch  = "";
  public permanenceSearchEquipamento  = "";
  public permanenceSearchSerial  = "";
  public serial = false;

  constructor(
    private InventoryService: InventoryService,
    private SuppliersService: SuppliersService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  inventory = [];

  ngOnInit() {

    this.generalInventory();
    this.loadSuppliers();
    this.tamanhoSelect();
  }




  changeSelect(event){

    if(event === "Bateria"){
        this.batteryInventory();
    }
  }
  tamanhoSelect(){
      $(window).resize(function(){
      var largura = $('.select2-container').width();
      var quadrado = $('.select2-container--open');
      quadrado.css({'width':'largura'});
    });
  }

  supplierInventory(event){

    if(event){
      this.InventoryService.getInventorySupplier(10,this.general.meta.page,event.value).subscribe(result => {
        this.supplier = result;
        this.name_supplier = result.data[0];
      }, err => {console.log(err)});
    }
  }

// Bateria inventario  ----------------------------------
  batteryInventory(){
    if(this.batterySearch){
      this.InventoryService.getInventoryBatteryByCode(10,this.general.meta.page,this.batterySearch).subscribe(result => this.battery = result, err => {console.log(err)});
    }else{
      this.InventoryService.getInventoryBattery(10,this.general.meta.page).subscribe(result => this.battery = result, err => {console.log(err)});
    }
  }

  quantityInventory(){
    if(this.quantitySearch){
        this.InventoryService.getInventoryQuantity(10,this.general.meta.page,this.quantitySearch).subscribe(result => this.quantity = result, err => {console.log(err)});
    }
  }
  generalInventory(){
    this.InventoryService.getInventoryGeneral(10,this.general.meta.page).subscribe(result => this.general = result, err => {console.log(err)});
  }

  permanenceInventory(){
    if(this.permanenceSearchEquipamento && this.permanenceSearchSerial ){
      this.serial = true;
      this.InventoryService.getInventoryPackingHistoric(10,this.general.meta.page,this.permanenceSearchSerial).subscribe(result => this.permanence = result, err => {console.log(err)});
    }else if(this.permanenceSearchEquipamento){
      this.serial = false;
      this.InventoryService.getInventoryPermanence(10,this.general.meta.page,this.permanenceSearchEquipamento).subscribe(result => this.permanence = result, err => {console.log(err)});
    }

  }

  loadSuppliers():void{

    this.SuppliersService.retrieveAll().subscribe(result => {
      this.suppliers = result;


      this.suppliers = result;
    }, err => {console.log(err)});
  }

  calculate(packing){
    if(packing.correct_plant_supplier && packing.correct_plant_factory){
      if(packing.correct_plant_supplier.equals(packing.actual_plant)){

      }else if(packing.correct_plant_factory.equals(packing.actual_plant)){

      }else{
        return '-'
      }
    }else{
      return "-";
    }

  }
  open(packing) {
          const modalRef = this.modalService.open(ModalInvComponent);
           modalRef.componentInstance.packing = packing;
  }

  // open() {
  //   const modalRef = this.modalService.open(ModalAlertaComponent);
  //   modalRef.componentInstance.name = 'World';
  // }

}

import { Component, OnInit, ChangeDetectorRef, OnDestroy  } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../shared/models/pagination';
import { Alert } from '../../shared/models/alert';
import { ModalInvComponent } from '../../shared/modal-inv/modal-inv.component';
import { LayerModalComponent } from '../../shared/modal-packing/layer.component';
import { InventoryLogisticService, AuthenticationService, PackingService, SuppliersService, InventoryService } from '../../servicos/index.service';
import { ChatService } from '../../servicos/teste';
declare var $: any;

//fazer uma refatoração esta muito grande e com o HTML gigantesco
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit, OnDestroy  {
  public logged_user: any;
  public suppliers: any;
  public name_supplier: any = '';
  public escolhaGeral: any = 'GERAL';
  public escolhaEquipamento = "";
  public packings: any[];
  public abpackings: any[];
  public ab_packings: any[];
  public escolhas: any[];
  public serials: any[];
  public abserials: any[];
  public locals: any[];
  public general: Pagination = new Pagination({ meta: { page: 1 } });
  public supplier: Pagination = new Pagination({ meta: { page: 1 } });
  public battery: Pagination = new Pagination({ meta: { page: 1 } });
  public permanence: Pagination = new Pagination({ meta: { page: 1 } });
  public absence: Pagination = new Pagination({ meta: { page: 1 } });
  public quantity: Pagination = new Pagination({ meta: { page: 1 } });
  public general_equipament: Pagination = new Pagination({ meta: { page: 1 } });
  public supplierSearch = null;
  public batterySearch = "";
  public quantitySearch = "";
  public permanenceSearchEquipamento: any;
  public permanenceSearchSerial = "";
  public absenceSearchEquipamento: any;
  public absenceSearchSerial: any;
  public absenceTime: any;
  public escolhaLocal: any;
  public generalEquipamentSearch = "";
  public serial = false;
  public abserial = false;
  public activeModal: any;

  ////////////// // REAL TIME SOCKER IO TEST
  // messages = [];

  // connection;

  // message;



  /////////////
  constructor(
    private inventoryLogisticService: InventoryLogisticService,
    private inventoryService: InventoryService,
    private suppliersService: SuppliersService,
    private packingService: PackingService,
    private modalService: NgbModal,
    private modalActive: NgbActiveModal,
    private ref: ChangeDetectorRef,
    private auth: AuthenticationService,
    private chatService: ChatService,
  ) {

    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();;
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine

    if (this.logged_user) {
      this.escolhas = [
        { name: 'GERAL' },
        { name: 'EQUIPAMENTO' },
      ];
    } else {
      this.escolhas = [
        { name: 'GERAL' },
        { name: 'EQUIPAMENTO' },
        { name: 'FORNECEDOR' }];
    }
  }

// REAL TIME SOCKER IO TEST
  // sendMessage() {
  //   console.log(this.message)
  //   this.chatService.sendMessage(this.message);

  //   this.message = '';

  // }


  changeSelect(event) {
    if (event === "Bateria") {
      this.batteryInventory();
    } else if (event === "Geral") {
      this.generalInventoryEquipament();
    }
  }


  tamanhoSelect() {
    $(window).resize(function () {
      var largura = $('.select2-container').width();
      var quadrado = $('.select2-container--open');
      quadrado.css({ 'width': 'largura' });
    });
  }

  supplierInventory(event: any): void {
    if (event){
      this.inventoryService.getInventorySupplier(10, this.supplier.meta.page, event._id).subscribe(result => {
        this.supplier = result;
        this.name_supplier = result.data[0];
      }, err => { console.log(err) });
   }else{
      this.inventoryService.getInventorySupplier(10, this.supplier.meta.page, this.name_supplier._id.supplier).subscribe(result => {
        this.supplier = result;
      }, err => { console.log(err) });
   }
      
    
  }

  // Bateria inventario  ----------------------------------
  batteryInventory() {
    if (this.logged_user instanceof Array) {
      this.inventoryLogisticService.getInventoryBattery(10, this.battery.meta.page, this.batterySearch, this.logged_user).subscribe(result => this.battery = result, err => { console.log(err) });
    } else {
      this.inventoryService.getInventoryBattery(10, this.battery.meta.page, this.batterySearch, this.logged_user).subscribe(result => this.battery = result, err => { console.log(err) });
    }
  }

  generalInventoryEquipament() {
    if (this.logged_user instanceof Array) {
      this.inventoryLogisticService.getInventoryGeneralPackings(10, this.general_equipament.meta.page, this.generalEquipamentSearch, this.logged_user).subscribe(result =>  this.general_equipament = result, err => { console.log(err) });
    } else {
      this.inventoryService.getInventoryGeneralPackings(10, this.general_equipament.meta.page, this.generalEquipamentSearch, this.logged_user).subscribe(result => this.general_equipament = result, err => { console.log(err) });
    }
  }

  quantityInventory() {
    if (this.logged_user instanceof Array) {
      this.inventoryLogisticService.getInventoryQuantity(10, this.quantity.meta.page, this.quantitySearch, this.logged_user).subscribe(result => this.quantity = result , err => { console.log(err) });
    } else {
      this.inventoryService.getInventoryQuantity(10, this.quantity.meta.page, this.quantitySearch, this.logged_user).subscribe(result => this.quantity = result , err => { console.log(err) });
    }

  }

  generalInventory() {
    if (this.logged_user instanceof Array) {
      this.inventoryLogisticService.getInventoryGeneral(10, this.general.meta.page, this.logged_user).subscribe(result => this.general = result, err => { console.log(err) });
    } else {
      this.inventoryService.getInventoryGeneral(10, this.general.meta.page, this.logged_user).subscribe(result => this.general = result, err => { console.log(err) });
    }
  }
  
  choiced(event: any) {
    if (event === "FORNECEDOR") {
      this.loadSuppliers();
    }
  }

  permanenceInventorySerial() {
    this.serial = true;

    this.inventoryService.getInventoryPackingHistoric(10, this.permanence.meta.page, this.permanenceSearchSerial, this.permanenceSearchEquipamento.packing, this.logged_user).subscribe(result => {
      this.permanence = result;
    }, err => { console.log(err) });

  }

  absenceInventorySerial() {
    this.serial = true;

    this.inventoryService.getInventoryAbsencePacking(10, this.permanence.meta.page, this.absenceSearchSerial, this.absenceSearchEquipamento.packing, this.logged_user).subscribe(result => {
      this.permanence = result;
    }, err => { console.log(err) });

  }

  //TODO MANY OTHER SERVICES TO RECOVER PACKINGS 
  permanenceInventory() {
    this.permanenceSearchSerial = "";
    this.serial = false;
    this.serials = [];

    if (this.permanenceSearchEquipamento.packing != "Todos"){
      
      this.packingService
        .getPackingsEquals(this.permanenceSearchEquipamento.supplier._id, this.permanenceSearchEquipamento.project._id, this.permanenceSearchEquipamento.packing)
        .subscribe(result => {
          this.serials = result.data;
          this.inventoryService
            .getInventoryPermanence(10, this.permanence.meta.page, this.permanenceSearchEquipamento.packing)
            .subscribe(result => this.permanence = result, err => { console.log(err) });
        }, err => { console.log(err) })
    } 
  }

  absenceInventory() {
    console.log(this.absenceSearchEquipamento);
    console.log(this.absenceTime);
    console.log(this.absenceSearchSerial);
    console.log(this.escolhaLocal);
    let oLocal;

    if (this.escolhaLocal == "Plantas do Fornecedor") { oLocal = 'supplier'}
    if (this.escolhaLocal == "Plantas dos Clientes") { oLocal = 'factory' }

    console.log(oLocal);

    if (this.absenceSearchEquipamento) {
      if (this.absenceSearchEquipamento.packing == "Todos") {
        this.absenceSearchSerial = "";
        this.abserial = false;
        this.abserials = [];
        this.inventoryService
          .getAbsencePermanence(10, this.absence.meta.page, this.absenceSearchEquipamento.packing, this.absenceTime, this.absenceSearchSerial, oLocal)
          .subscribe(result => {
            if (result.data) {

              this.absence = result
              console.log(result.data)
            }
          }, err => { console.log(err) });

      } else{

        this.packingService
          .getPackingsEquals(this.absenceSearchEquipamento.supplier._id, this.absenceSearchEquipamento.project._id, this.absenceSearchEquipamento.packing)
          .subscribe(result => {
            this.abserials = result.data;
            this.inventoryService
              .getAbsencePermanence(10, this.absence.meta.page, this.absenceSearchEquipamento.packing, this.absenceTime, this.absenceSearchSerial, oLocal)
              .subscribe(result => {
                console.log("aquii")
                console.log(result.data)
                if (result.data){
                 
                  this.absence = result
                  console.log(result.data)
                }
              }, err => { console.log(err) });
          }, err => { console.log(err) })
      }
    }else{
      this.absenceSearchSerial = "";
      this.abserial = false;
      this.abserials = [];
    }

  }

 

  loadSuppliers(): void {
    this.suppliersService.retrieveAll().subscribe(result => this.suppliers = result.data , err => { console.log(err) });
  }

  open(packing) {
    const modalRef = this.modalService.open(ModalInvComponent);
    modalRef.componentInstance.packing = packing;
  }

  openLayer(packing) {
    const modalRef = this.modalService.open(LayerModalComponent, { backdrop: "static", size: "lg" });
    modalRef.componentInstance.packing = packing;
  }

  ngOnInit() {

    this.generalInventory();
    this.tamanhoSelect();
    this.loadPackings();
    this.loadAbPackings();
    this.loadLocals();

    // REAL TIME SOCKER IO TEST
    // this.connection = this.chatService.getMessages().subscribe(message => {
    //   console.log(this.messages.length)
    //   this.messages.push(message);

    // })
  }
// <!--TEST SOCKER IO REAL TIME-- >
  ngOnDestroy() {

    // this.connection.unsubscribe();

  }

  loadLocals() {
    this.locals = [ { "local" : "Todos"} , {"local": "Fornecedor"}, { "local": "Clientes"} ];
  }

  loadPackings() {
    if (this.logged_user instanceof Array) {
      this.packingService.getPackingsDistinctsByLogistic(this.logged_user).subscribe(result => this.packings = result.data, err => { console.log(err) });

    } else if (this.logged_user) {
      this.packingService.getPackingsDistinctsBySupplier(this.logged_user).subscribe(result => this.packings = result.data, err => { console.log(err) });
    } else {
      this.packingService.getPackingsDistincts().subscribe(result => {this.packings = result.data}, err => { console.log(err) });
    }
  }

  loadAbPackings() {
    if (this.logged_user instanceof Array) {
      this.packingService.getPackingsDistinctsByLogistic(this.logged_user).subscribe(result => this.ab_packings = result.data, err => { console.log(err) });

    } else if (this.logged_user) {
      this.packingService.getPackingsDistinctsBySupplier(this.logged_user).subscribe(result => this.ab_packings = result.data, err => { console.log(err) });
    } else {
      this.packingService.getPackingsDistincts().subscribe(result =>  {
        this.ab_packings = []
        this.ab_packings.push({ "packing": "Todos" }) 
        this.ab_packings = this.ab_packings.concat(result.data);
        this.absenceTime = 10;
        console.log(this.ab_packings)
      }, err => { console.log(err) });
    }
  }


  openHelp(content) {
    this.activeModal = this.modalService.open(content);
  }

  onClear() {
    this.serial = false;
    this.serials = [];
    this.permanence = new Pagination({ meta: { page: 1 } })
    this.permanence.data =  []
    this.permanenceSearchSerial = "";
  }



}

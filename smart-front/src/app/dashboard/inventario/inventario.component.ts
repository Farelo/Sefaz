import { Component, OnInit, ChangeDetectorRef, OnDestroy  } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../shared/models/pagination';
import { Alert } from '../../shared/models/alert';
import { ModalInvComponent } from '../../shared/modal-inv/modal-inv.component';
import { LayerModalComponent } from '../../shared/modal-packing/layer.component';
import { AbscenseModalComponent } from '../../shared/modal-packing-absence/abscense.component';
import { InventoryLogisticService, AuthenticationService, PackingService, SuppliersService, InventoryService } from '../../servicos/index.service';
import { ChatService } from '../../servicos/teste';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
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
  public detailedGeneralpackings: any[];
  public abpackings: any[];
  public ab_packings: any[];
  public escolhas: any[];
  public serials: any[];
  public abserials: any[];
  public locals: any[];
  public general:     Pagination = new Pagination({ meta: { page: 1 } });
  public supplier:    Pagination = new Pagination({ meta: { page: 1 } });
  public battery:     Pagination = new Pagination({ meta: { page: 1 } });
  public permanence:  Pagination = new Pagination({ meta: { page: 1 } });
  public absence:     Pagination = new Pagination({ meta: { page: 1 } });
  public quantity:    Pagination = new Pagination({ meta: { page: 1 } });
  public general_equipament: Pagination = new Pagination({ meta: { page: 1 } });
  public detailedGeneralInventory: Pagination = new Pagination({ meta: { page: 1 } });
  public detailedInventorySupplierSearch = null;
  public detailedInventoryEquipamentSearch = null;
  public detailedInventorySearchSerial = "";
  public supplierSearch = null;
  public batterySearch = "";
  public quantitySearch = "";
  public permanenceSearchEquipamento: any;
  public permanenceSearchSerial = "";
  public absenceSearchEquipamento: any;
  public absenceSearchSerial: any;
  public absenceTime: any;
  public escolhaLocal = "Factory";
  public generalEquipamentSearch = "";
  public serial = false;
  public abserial = false;
  public activeModal: any;

  public isCollapsed = false;
  //public dataList: any[] = [];

  ////////////// // REAL TIME SOCKER IO TEST
  // messages = [];

  // connection;

  // message;

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
    private chatService: ChatService
  ) {

    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
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
    } else if (event === "Tempo de ausência") {
      this.escolhaLocal = "Supplier";
      this.absenceInventory();
    } else if (event === "Inventário Geral") {
      this.loadSuppliers();
      this.loadDetailedInventory();
    }
  }

  public getChild(parent: any = { plant_name: ''}) {
    return parent.plant_name
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

    if (this.permanenceSearchEquipamento.packing){
      
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
    this.absence = new Pagination({ meta: { page: 1 } });
  
    if (this.absenceSearchEquipamento) {
        this.packingService
          .getPackingsEquals(this.absenceSearchEquipamento.supplier._id, this.absenceSearchEquipamento.project._id, this.absenceSearchEquipamento.packing)
          .subscribe(result => {
            this.abserials = result.data;
            this.inventoryService
              .getAbsencePermanence(10, this.absence.meta.page, this.absenceSearchEquipamento.packing, this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
              .subscribe(result => {
               
                if (result.data){
                 
                  this.absence = result
                }
              }, err => { console.log(err) });
          }, err => { console.log(err) })
    }else{
      this.inventoryService
        .getAbsencePermanence(10, this.absence.meta.page, "todos", this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
        .subscribe(result => {

          if (result.data) {

            this.absence = result
          }
        }, err => { console.log(err) });
      this.absenceSearchSerial = "";
      this.abserial = false;
      this.abserials = [];
      this.absence.data = []
    }
  }

  absenceInventoryChangePage() {
    
    if (this.absenceSearchEquipamento) {
      

        this.packingService
          .getPackingsEquals(this.absenceSearchEquipamento.supplier._id, this.absenceSearchEquipamento.project._id, this.absenceSearchEquipamento.packing)
          .subscribe(result => {
            this.abserials = result.data;
            this.inventoryService
              .getAbsencePermanence(10, this.absence.meta.page, this.absenceSearchEquipamento.packing, this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
              .subscribe(result => {
               
                if (result.data){
                 
                  this.absence = result
                }
              }, err => { console.log(err) });
          }, err => { console.log(err) })
      
    }else{
      this.inventoryService
        .getAbsencePermanence(10, this.absence.meta.page, "todos", this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
        .subscribe(result => {

          if (result.data) {

            this.absence = result
          }
        }, err => { console.log(err) });
      this.absenceSearchSerial = "";
      this.abserial = false;
      this.abserials = [];
    }

  }

 

  

  open(packing) {
    const modalRef = this.modalService.open(ModalInvComponent);
    modalRef.componentInstance.packing = packing;
  }

  openLayer(packing) {
    const modalRef = this.modalService.open(LayerModalComponent, { backdrop: "static", size: "lg" });
    modalRef.componentInstance.packing = packing;
  }

  openAbsence(packing) {
    const modalRef = this.modalService.open(AbscenseModalComponent, { backdrop: "static", size: "lg" });
    modalRef.componentInstance.packing = packing;
  }

  loadSuppliers(): void {
    this.suppliersService.retrieveAll().subscribe(result => this.suppliers = result.data , err => { console.log(err) });
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
        
        this.ab_packings = result.data;
        this.absenceTime = 10;
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

  /**
   * Emanoel
   * Inventário Geral
   */

  /**
  * Initial configuration of all collapses
  * @param  Initial state: true(collapsed) or false(expanded)
  */
  setInitialCollapse(state: boolean){
    this.detailedGeneralInventory.data.map(o => {
      o.isCollapsed = state;
      return o;
    })
  }

  /**
   * Loads the initial list of detailed inventory
   */
  loadDetailedInventory(): void {
    this.inventoryService.getDetailedGeneralInventory(10, this.detailedGeneralInventory.meta.page).subscribe(result => {      
      this.detailedGeneralInventory = result;
      this.setInitialCollapse(true);
    }, err => { console.log(err) });
  }

  /**
   * Loads the list of plants in the details of a table row
   * @param event The object that represents the entire clicked row 
   */
  loadPlantsInDetailedInventory(event: any): void {
    console.log(JSON.stringify(event));
  }

  private selectedSupplier: any;
  private selectedEquipament: any;

  /**
   * A supplier was selected
   */
  supplierDetailedInventory(event: any): void {

    if (event) {
      this.selectedSupplier = event;
      this.packingService.getPackingsDistinctsBySupplier(event._id).subscribe(result => {
        this.detailedGeneralpackings = result.data;
        
        this.inventoryService.getDetailedGeneralInventoryBySupplier(10, this.detailedGeneralInventory.meta.page, event._id).subscribe(res => {
          this.detailedGeneralInventory = res;
          this.setInitialCollapse(true);
        }, err => { console.log(err) });
      }, err => { console.log(err) });

      console.log('selectedSupplier: ' + JSON.stringify(this.selectedSupplier));
    } else {
      this.loadDetailedInventory()
      this.selectedSupplier = null
    }
  }

  /**
   * An equipment was selected
   */
  equipamentDetailedInventory(event: any){
    if(event){
      this.selectedEquipament = event;
      console.log(event)
      this.inventoryService.getDetailedGeneralInventoryBySupplierAndEquipment(10, this.detailedGeneralInventory.meta.page, this.selectedSupplier._id, event.packing).subscribe(res => {
        console.log(res)
        this.detailedGeneralInventory = res;
        this.setInitialCollapse(true);
      }, err => { console.log(err) });
    }
  }


  detailedGeneralInventoryChangePage(event: any): void {
    console.log('detailedGeneralInventoryChangePage');
  }

  private csvOptions = {
    showLabels: true,
    fieldSeparator: ';'
  };

  downloadExcel(): void {
    console.log('Download on excel');

    
    let params = {};
    if (this.selectedSupplier) params['supplier_id'] = this.selectedSupplier._id;
    if (this.selectedEquipament) params['package_code'] = this.selectedEquipament._id.code;
    
    this.inventoryService.getDataToCsv(params).subscribe(result => {
      
      new Angular2Csv(this.shapeObject(result.data), 'InventarioGeral', this.csvOptions);
    }, err => { console.log(err) });

  }

  /**
   * Retrieves the data in the server and shape the object to the csv library
   * @param array The array of objects to save in the csv. Each object represents a row in the file
   */
  shapeObject(array: any){
    
    let plain = array.map(obj => {
      return {
        supplierName: obj.supplier.name,
        equipmentCode: obj._id.code,
        quantityTotal: obj.quantityTotal,
        quantityInFactory: obj.quantityInFactory,
        quantityInSupplier: obj.quantityInSupplier,
        quantityTraveling: obj.quantityTraveling,
        quantityProblem: obj.quantityProblem,
        totalOnline: (parseInt(obj.quantityInFactory) + parseInt(obj.quantityInSupplier) + parseInt(obj.quantityTraveling) + parseInt(obj.quantityProblem)),
        quantityDifference: (parseInt(obj.quantityTotal) - (parseInt(obj.quantityInFactory) + parseInt(obj.quantityInSupplier) + parseInt(obj.quantityTraveling) + parseInt(obj.quantityProblem))),
        lateObject: obj.all_alerts[0].late_object,
        incorrectObject: obj.all_alerts[0].incorrect_object,
        permanenceTime: obj.all_alerts[0].permanence_time,
        lostObject: obj.all_alerts[0].lost_object
      };
    });

    //console.log('plain: ' + JSON.stringify(plain));

    return plain;
  }

}

import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../shared/models/pagination';
import { ModalInvComponent } from '../../shared/modal-inv/modal-inv.component';
import { LayerModalComponent } from '../../shared/modal-packing/layer.component';
import { AbscenseModalComponent } from '../../shared/modal-packing-absence/abscense.component';
import { InventoryLogisticService, AuthenticationService, PackingService, SuppliersService, InventoryService } from '../../servicos/index.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

//fazer uma refatoração esta muito grande e com o HTML gigantesco
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})

export class InventarioComponent implements OnInit, OnDestroy {
  public logged_user: any;
  public suppliers: any;
  public name_supplier: any = '';
  public escolhaGeral: any = '';
  public escolhaEquipamento = "";
  public packings: any[];
  public detailedGeneralpackings: any[];
  public abpackings: any[];
  public ab_packings: any[];
  public escolhas: any[];
  public optionsEquipment: any[];
  public abserials: any[];
  public locals: any[];
  public general: Pagination = new Pagination({ meta: { page: 1 } });
  public supplier: Pagination = new Pagination({ meta: { page: 1 } });

  public absence: Pagination = new Pagination({ meta: { page: 1 } });

  public general_equipament: Pagination = new Pagination({ meta: { page: 1 } });
  public detailedGeneralInventory: Pagination = new Pagination({ meta: { page: 1 } });
  public detailedInventorySupplierSearch = null;
  public detailedInventoryEquipamentSearch = null;
  public detailedInventorySearchSerial = "";
  public supplierSearch = null;


  public absenceSearchEquipamento: any;
  public absenceSearchSerial: any;
  public absenceTime: any;
  public escolhaLocal = "Factory";
  public generalEquipamentSearch = "";
  public abserial = false;
  public activeModal: any;
  public isCollapsed = false;

  //Tempo de permanência
  public permanenceSearchSerial = null;
  public serials: any[];
  public serial = false;
  public permanence: Pagination = new Pagination({ meta: { page: 1 } });
  public permanenceSearchEquipamento: any;

  ngOnInit() {

    // this.generalInventory();
    // this.tamanhoSelect();
    // this.loadPackings();
    // this.loadAbPackings();
    // this.loadLocals();
  }

  ngOnDestroy() {

    // this.connection.unsubscribe();
  }

  /////////////
  constructor(
    public translate: TranslateService,
    private inventoryLogisticService: InventoryLogisticService,
    private inventoryService: InventoryService,
    private suppliersService: SuppliersService,
    private packingService: PackingService,
    private modalService: NgbModal,
    private modalActive: NgbActiveModal,
    private ref: ChangeDetectorRef,
    private auth: AuthenticationService) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');

    this.prepareMenu();

    this.escolhaGeral = { name: this.translate.instant('INVENTORY.HEADER.GENERAL_INVENTORY'), value: 0 };
    this.escolhaEquipamento = null;

    this.translate.onLangChange.subscribe((event) => {
      console.log(event);
      this.prepareMenu();
    });

  }

  prepareMenu() {
    this.escolhas = [
      { name: this.translate.instant('INVENTORY.HEADER.GENERAL_CAP'), value: 0 },
      { name: this.translate.instant('INVENTORY.HEADER.EQUIPMENT'), value: 1 },
      { name: this.translate.instant('INVENTORY.HEADER.SUPPLIER'), value: 2 }];

    this.optionsEquipment = [
      { name: this.translate.instant('INVENTORY.HEADER.GENERAL'), value: 0 },
      { name: this.translate.instant('INVENTORY.HEADER.PERMANENCE_TIME'), value: 1 },
      { name: this.translate.instant('INVENTORY.HEADER.ABSENT_TIME'), value: 2 },
      { name: this.translate.instant('INVENTORY.HEADER.BATTERY'), value: 3 },
      { name: this.translate.instant('INVENTORY.HEADER.QUANTITY'), value: 4 },
      { name: this.translate.instant('INVENTORY.HEADER.EQUIPMENT_GENERAL'), value: 5 },
      { name: this.translate.instant('INVENTORY.HEADER.POSITIONS'), value: 6 },
    ];
  }

  changeGeneralOption(event) {
    this.escolhaEquipamento = null;
  }

  changeSelect(event) {
    // if (event === "Bateria") {

    // } else if (event === "Geral") {
    //   this.generalInventoryEquipament();
    // } else if (event === "Tempo de ausência") {
    //   this.escolhaLocal = "Supplier";
    //   this.absenceInventory();
    // } else if (event === "Inventário Geral") {
    //   this.loadSuppliers();
    //   this.loadDetailedInventory();
    // }
  }

  // tamanhoSelect() {
  //   $(window).resize(function () {
  //     var largura = $('.select2-container').width();
  //     var quadrado = $('.select2-container--open');
  //     quadrado.css({ 'width': 'largura' });
  //   });
  // }




  // generalInventoryEquipament() {
  //   if (this.logged_user instanceof Array) {
  //     this.inventoryLogisticService.getInventoryGeneralPackings(10, this.general_equipament.meta.page, this.generalEquipamentSearch, this.logged_user).subscribe(result =>  this.general_equipament = result, err => { console.log(err) });
  //   } else {
  //     this.inventoryService.getInventoryGeneralPackings(10, this.general_equipament.meta.page, this.generalEquipamentSearch, this.logged_user).subscribe(result => this.general_equipament = result, err => { console.log(err) });
  //   }
  // }



  // generalInventory() {
  //   if (this.logged_user instanceof Array) {
  //     this.inventoryLogisticService.getInventoryGeneral(10, this.general.meta.page, this.logged_user).subscribe(result => this.general = result, err => { console.log(err) });
  //   } else {
  //     this.inventoryService.getInventoryGeneral(10, this.general.meta.page, this.logged_user).subscribe(result => this.general = result, err => { console.log(err) });
  //   }
  // }

  // choiced(event: any) {
  //   if (event === "FORNECEDOR") {
  //     //this.loadSuppliers();
  //   } 
  // }

  // permanenceInventorySerial() {
  //   console.log('serial chenaged to: ' + this.permanenceSearchSerial);
  //   //this.permanenceSearchSerial = undefined;
  //   // if ((this.permanenceSearchSerial !== null) && (this.permanenceSearchSerial !== undefined)){
  //   //   this.serial = true;

  //   //   this.inventoryService.getInventoryPackingHistoric(10, this.permanence.meta.page, this.permanenceSearchSerial, this.permanenceSearchEquipamento.packing, this.logged_user).subscribe(result => {
  //   //     this.permanence = result;
  //   //   }, err => { console.log(err) });
  //   // }
  // }

  // absenceInventorySerial() {
  //   this.serial = true;

  //   this.inventoryService.getInventoryAbsencePacking(10, this.permanence.meta.page, this.absenceSearchSerial, this.absenceSearchEquipamento.packing, this.logged_user).subscribe(result => {
  //     this.permanence = result;
  //   }, err => { console.log(err) });

  // }

  // //TODO MANY OTHER SERVICES TO RECOVER PACKINGS 
  // permanenceInventory() {
  //   this.permanenceSearchSerial = null;
  //   this.serial = false;
  //   this.serials = [];

  //   if (this.permanenceSearchEquipamento !== null){

  //     console.log('this.permanenceSearchEquipamento.packing: ' + this.permanenceSearchEquipamento);

  //     this.packingService
  //       .getPackingsEquals(this.permanenceSearchEquipamento.supplier._id, this.permanenceSearchEquipamento.project._id, this.permanenceSearchEquipamento.packing)
  //       .subscribe(result => {
  //         this.serials = result.data;
  //         // this.inventoryService
  //         //   .getInventoryPermanence(10, this.permanence.meta.page, this.permanenceSearchEquipamento.packing)
  //         //   .subscribe(result => this.permanence = result, err => { console.log(err) });
  //       }, err => { console.log(err) })
  //   } 
  // }

  // absenceInventory() {
  //   this.absence = new Pagination({ meta: { page: 1 } });

  //   if (this.absenceSearchEquipamento) {
  //       this.packingService
  //         .getPackingsEquals(this.absenceSearchEquipamento.supplier._id, this.absenceSearchEquipamento.project._id, this.absenceSearchEquipamento.packing)
  //         .subscribe(result => {
  //           this.abserials = result.data;
  //           this.inventoryService
  //             .getAbsencePermanence(10, this.absence.meta.page, this.absenceSearchEquipamento.packing, this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
  //             .subscribe(result => {

  //               if (result.data){

  //                 this.absence = result
  //               }
  //             }, err => { console.log(err) });
  //         }, err => { console.log(err) })
  //   }else{
  //     this.inventoryService
  //       .getAbsencePermanence(10, this.absence.meta.page, "todos", this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
  //       .subscribe(result => {

  //         if (result.data) {

  //           this.absence = result
  //         }
  //       }, err => { console.log(err) });
  //     this.absenceSearchSerial = "";
  //     this.abserial = false;
  //     this.abserials = [];
  //     this.absence.data = []
  //   }
  // }

  // absenceInventoryChangePage() {

  //   if (this.absenceSearchEquipamento) {


  //       this.packingService
  //         .getPackingsEquals(this.absenceSearchEquipamento.supplier._id, this.absenceSearchEquipamento.project._id, this.absenceSearchEquipamento.packing)
  //         .subscribe(result => {
  //           this.abserials = result.data;
  //           this.inventoryService
  //             .getAbsencePermanence(10, this.absence.meta.page, this.absenceSearchEquipamento.packing, this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
  //             .subscribe(result => {

  //               if (result.data){

  //                 this.absence = result
  //               }
  //             }, err => { console.log(err) });
  //         }, err => { console.log(err) })

  //   }else{
  //     this.inventoryService
  //       .getAbsencePermanence(10, this.absence.meta.page, "todos", this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
  //       .subscribe(result => {

  //         if (result.data) {

  //           this.absence = result
  //         }
  //       }, err => { console.log(err) });
  //     this.absenceSearchSerial = "";
  //     this.abserial = false;
  //     this.abserials = [];
  //   }

  // }



  // openAbsence(packing) {
  //   const modalRef = this.modalService.open(AbscenseModalComponent, { backdrop: "static", size: "lg" });
  //   modalRef.componentInstance.packing = packing;
  // }

  // loadSuppliers(): void {
  //   this.suppliersService.retrieveAll().subscribe(result => this.suppliers = result.data , err => { console.log(err) });
  // }

  // loadLocals() {
  //   this.locals = [ { "local" : "Todos"} , {"local": "Fornecedor"}, { "local": "Clientes"} ];
  // }

  // loadPackings() {
  //   if (this.logged_user instanceof Array) {
  //     this.packingService.getPackingsDistinctsByLogistic(this.logged_user).subscribe(result => this.packings = result.data, err => { console.log(err) });

  //   } else if (this.logged_user) {
  //     this.packingService.getPackingsDistinctsBySupplier(this.logged_user).subscribe(result => this.packings = result.data, err => { console.log(err) });
  //   } else {
  //     this.packingService.getPackingsDistincts().subscribe(result => {this.packings = result.data}, err => { console.log(err) });
  //   }
  // }

  // loadAbPackings() {
  //   if (this.logged_user instanceof Array) {
  //     this.packingService.getPackingsDistinctsByLogistic(this.logged_user).subscribe(result => this.ab_packings = result.data, err => { console.log(err) });

  //   } else if (this.logged_user) {
  //     this.packingService.getPackingsDistinctsBySupplier(this.logged_user).subscribe(result => this.ab_packings = result.data, err => { console.log(err) });
  //   } else {
  //     this.packingService.getPackingsDistincts().subscribe(result =>  {

  //       this.ab_packings = result.data;
  //       this.absenceTime = 10;
  //     }, err => { console.log(err) });
  //   }
  // }


  // openHelp(content) {
  //   this.activeModal = this.modalService.open(content);
  // }

  // onClear() {
  //   console.log('clear equipment');
  //   this.serial = false;
  //   this.serials = [];
  //   this.permanence = new Pagination({ meta: { page: 1 } })
  //   this.permanence.data =  []
  //   this.permanenceSearchSerial = null;
  // }

  // /**
  //  * Emanoel
  //  * Inventário Geral
  //  */

  // /**
  // * Initial configuration of all collapses
  // * @param  Initial state: true(collapsed) or false(expanded)
  // */
  // setInitialCollapse(state: boolean){
  //   this.detailedGeneralInventory.data.map(o => {
  //     o.isCollapsed = state;
  //     return o;
  //   })
  // }

  // /**
  //  * Loads the initial list of detailed inventory
  //  */
  // loadDetailedInventory(): void {
  //   this.inventoryService.getDetailedGeneralInventory(10, this.detailedGeneralInventory.meta.page).subscribe(result => {      
  //     this.detailedGeneralInventory = result;
  //     this.setInitialCollapse(true);
  //   }, err => { console.log(err) });
  // }

  // /**
  //  * Loads the list of plants in the details of a table row
  //  * @param event The object that represents the entire clicked row 
  //  */
  // loadPlantsInDetailedInventory(event: any): void {
  //   console.log(JSON.stringify(event));
  // }

  // private selectedSupplier: any;
  // private selectedEquipament: any;

  // /**
  //  * A supplier was selected
  //  */
  // supplierDetailedInventory(event: any): void {

  //   if (event) {
  //     this.selectedSupplier = event;
  //     this.packingService.getPackingsDistinctsBySupplier(event._id).subscribe(result => {
  //       this.detailedGeneralpackings = result.data;

  //       this.inventoryService.getDetailedGeneralInventoryBySupplier(10, this.detailedGeneralInventory.meta.page, event._id).subscribe(res => {
  //         this.detailedGeneralInventory = res;
  //         this.setInitialCollapse(true);
  //       }, err => { console.log(err) });
  //     }, err => { console.log(err) });

  //   } else {
  //     this.loadDetailedInventory()
  //     this.selectedSupplier = null
  //   }
  // }

  // /**
  //  * An equipment was selected
  //  */
  // equipamentDetailedInventory(event: any){
  //   if(event)
  //     this.selectedEquipament = event;
  // }


  // detailedGeneralInventoryChangePage(event: any): void {
  //   console.log('detailedGeneralInventoryChangePage');
  // }
  // // 

  // private csvOptions = {
  //   showLabels: true,
  //   fieldSeparator: ';'
  // };

  // downloadExcel(): void {
  //   console.log('Download on excel');


  //   let params = {};
  //   if (this.selectedSupplier) params['supplier_id'] = this.selectedSupplier._id;
  //   if (this.selectedEquipament) params['package_code'] = this.selectedEquipament._id.code;

  //   this.inventoryService.getDataToCsv(params).subscribe(result => {

  //     new Angular2Csv(this.shapeObject(result.data), 'InventarioGeral', this.csvOptions);
  //   }, err => { console.log(err) });

  // }

  // /**
  //  * Retrieves the data in the server and shape the object to the csv library
  //  * @param array The array of objects to save in the csv. Each object represents a row in the file
  //  */
  // shapeObject(array: any){

  //   let plain = array.map(obj => {
  //     return {
  //       supplierName: obj.supplier.name,
  //       equipmentCode: obj._id.code,
  //       quantityTotal: obj.quantityTotal,
  //       quantityInFactory: obj.quantityInFactory,
  //       quantityInSupplier: obj.quantityInSupplier,
  //       quantityTraveling: obj.quantityTraveling,
  //       quantityProblem: obj.quantityProblem,
  //       totalOnline: (parseInt(obj.quantityInFactory) + parseInt(obj.quantityInSupplier) + parseInt(obj.quantityTraveling)),
  //       quantityDifference: (parseInt(obj.quantityTotal) - (parseInt(obj.quantityInFactory) + parseInt(obj.quantityInSupplier) + parseInt(obj.quantityTraveling))),
  //       lateObject: obj.all_alerts[0] == undefined ? 0 : obj.all_alerts[0].late_object,
  //       incorrectObject: obj.all_alerts[0] == undefined ? 0 : obj.all_alerts[0].incorrect_object,
  //       permanenceTime: obj.all_alerts[0] == undefined ? 0 : obj.all_alerts[0].permanence_time,
  //       lostObject: obj.all_alerts[0] == undefined ? 0 : obj.all_alerts[0].lost_object
  //     };
  //   });

  //   let cabecalho = {
  //     supplierName: 'Fornecedor',
  //     equipmentCode: 'Equipamento',
  //     quantityTotal: 'Total de Equipamentos do Fornecedor(TEF)',
  //     quantityInFactory: 'Quantidade nas Plantas(A)',
  //     quantityInSupplier: 'Quantidade no Fornecedor(B)',
  //     quantityTraveling: 'Quantidade no Transito(C)',
  //     quantityProblem: 'Quantidade em Local Incorreto',
  //     totalOnline: 'Total do Inventário On Line(TIOL = A + B + C)',
  //     quantityDifference: 'Diferença(TEF - TIOL)',
  //     lateObject: 'Atraso de Rota',
  //     incorrectObject: 'Local Incorreto',
  //     permanenceTime: 'Tempo de Permanencia',
  //     lostObject: 'Embalagem Ausente'
  //   }

  //   plain.unshift(cabecalho);

  //   return plain;

  // }

}

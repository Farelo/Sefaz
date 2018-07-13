import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../../shared/models/pagination'; 
import { InventoryLogisticService, AuthenticationService, PackingService, SuppliersService, InventoryService } from '../../../servicos/index.service';
import { ChatService } from '../../../servicos/teste';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-inventario-geral',
  templateUrl: './inventario-geral.component.html',
  styleUrls: ['./inventario-geral.component.css']
})

export class InventarioGeralComponent implements OnInit {

  @Input() supplier: string;
  @Input() equipment: string;

  public logged_user: any;
  public detailedGeneralInventory: Pagination = new Pagination({ meta: { page: 1 } });
  public detailedGeneralpackings: any[];
  public suppliers: any;
  
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
    let current_user = this.auth.currentUser();
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine
  }

  ngOnInit() {
    this.loadSuppliers();
    this.loadDetailedInventory();
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['supplier']) {
      //console.log('ngOnChanges supplier: ' + JSON.stringify(this.supplier));
      this.supplierDetailedInventory(this.supplier);
    }
    
    if (changes['equipment']) {
      //console.log('ngOnChanges equipment: ' + JSON.stringify(this.supplier));
      this.equipamentDetailedInventory(this.equipment);
    }
  }

  public getChild(parent: any = { plant_name: '' }) {
    return parent.plant_name
  }
  
  /**
  * Initial configuration of all collapses
  * @param  Initial state: true(collapsed) or false(expanded)
  */
  setInitialCollapse(state: boolean) {
    this.detailedGeneralInventory.data.map(o => {
      o.isCollapsed = state;
      return o;
    })
  }

  thereResult(all_plants: any){
    let acum = 0;
    
    //console.log('all_plants: ' + JSON.stringify(all_plants));

    for (let i = 0; i < all_plants.length; i++){

      if (all_plants[i].current_plant.plant !== undefined){
        console.log('current_plant: ' + JSON.stringify(all_plants[i].current_plant));
        acum++;
        break;
      }
    }

    console.log('acum: ' + acum);
    return acum;
  }

  loadSuppliers(): void {
    this.suppliersService.retrieveAll().subscribe(result => this.suppliers = result.data, err => { console.log(err) });
  }
  
  /**
   * Loads the initial list of detailed inventory
   */
  loadDetailedInventory(): void {
    this.inventoryService.getDetailedGeneralInventory(10, this.detailedGeneralInventory.meta.page).subscribe(result => {
      this.detailedGeneralInventory = result;
      this.setInitialCollapse(true);
      console.log('this.detailedGeneralInventory: ' + JSON.stringify(this.detailedGeneralInventory));
    }, err => { console.log(err) });
  }

  /**
   * Loads the list of plants in the details of a table row
   * @param event The object that represents the entire clicked row 
   */
  loadPlantsInDetailedInventory(event: any): void {
    //console.log(JSON.stringify(event));
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
  equipamentDetailedInventory(event: any) {
    if (event) {
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
  shapeObject(array: any) {

    let plain = array.map(obj => {
      return {
        supplierName: obj.supplier.name,
        equipmentCode: obj._id.code,
        quantityTotal: obj.quantityTotal,
        quantityInFactory: obj.quantityInFactory,
        quantityInSupplier: obj.quantityInSupplier,
        quantityTraveling: obj.quantityTraveling,
        quantityProblem: obj.quantityProblem,
        totalOnline: (parseInt(obj.quantityInFactory) + parseInt(obj.quantityInSupplier) + parseInt(obj.quantityTraveling)),
        quantityDifference: (parseInt(obj.quantityTotal) - (parseInt(obj.quantityInFactory) + parseInt(obj.quantityInSupplier) + parseInt(obj.quantityTraveling))),
        lateObject: obj.all_alerts[0] == undefined ? 0 : obj.all_alerts[0].late_object,
        incorrectObject: obj.all_alerts[0] == undefined ? 0 : obj.all_alerts[0].incorrect_object,
        permanenceTime: obj.all_alerts[0] == undefined ? 0 : obj.all_alerts[0].permanence_time,
        lostObject: obj.all_alerts[0] == undefined ? 0 : obj.all_alerts[0].lost_object
      };
    });

    let cabecalho = {
      supplierName: 'Fornecedor',
      equipmentCode: 'Equipamento',
      quantityTotal: 'Total de Equipamentos do Fornecedor(TEF)',
      quantityInFactory: 'Quantidade nas Plantas(A)',
      quantityInSupplier: 'Quantidade no Fornecedor(B)',
      quantityTraveling: 'Quantidade no Transito(C)',
      quantityProblem: 'Quantidade em Local Incorreto',
      totalOnline: 'Total do Inventário On Line(TIOL = A + B + C)',
      quantityDifference: 'Diferença(TEF - TIOL)',
      lateObject: 'Atraso de Rota',
      incorrectObject: 'Local Incorreto',
      permanenceTime: 'Tempo de Permanencia',
      lostObject: 'Embalagem Ausente'
    }

    plain.unshift(cabecalho);

    return plain;

  }

}

import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../../shared/models/pagination'; 
import { InventoryLogisticService, AuthenticationService, PackingService, SuppliersService, InventoryService, ReportsService, CompaniesService, FamiliesService } from '../../../servicos/index.service';
import { ChatService } from '../../../servicos/teste';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-inventario-geral',
  templateUrl: './inventario-geral.component.html',
  styleUrls: ['./inventario-geral.component.css']
})

export class InventarioGeralComponent implements OnInit {

  public listOfCompanies: any[] = []; 
  public mCompany: any = null;

  public listOfPackings: any[] = [];
  public mPacking: any = null;

  public detailedGeneralInventory: any[] = [];
  public auxDetailedGeneralInventory: any[] = [];
  
  public actualPage: number = -1;
  
  constructor(
    private reportService: ReportsService,
    private inventoryService: InventoryService,
    protected companiesService: CompaniesService,
    private packingService: PackingService,
    private familyService: FamiliesService,
    private auth: AuthenticationService,
    private chatService: ChatService) {

    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
  }

  ngOnInit() {

    this.loadCompanies(); 
    this.loadDetailedInventory();
  }
  
  /**
   * Load the list of companies
   */
  loadCompanies(): void {

    this.familyService.getAllFamilies().subscribe(result => { 

      let auxListOfCompanies = [];

      result.map(elem => {
        if (auxListOfCompanies.length < 1) {
          auxListOfCompanies.push(elem.company);

        } else {
          if (auxListOfCompanies.map(e => e._id).indexOf(elem.company._id) === -1) 
            auxListOfCompanies.push(elem.company);
        }
      }); 

      console.log(JSON.stringify(auxListOfCompanies));

      // o view só muda quando há atribuição, 
      // se fizer push direto no array ele não muda no select do view
      this.listOfCompanies = auxListOfCompanies;

    }, err => console.error(err));
  }

  /**
   * Loads the initial list of detailed inventory
   */
  loadDetailedInventory(): void {
    this.reportService.getGeneralEquipmentInventory().subscribe(result => {

      this.detailedGeneralInventory = result;
      this.auxDetailedGeneralInventory = result;
      this.setInitialCollapse(true);
      //console.log('this.detailedGeneralInventory: ' + JSON.stringify(this.detailedGeneralInventory));
    }, err => { console.log(err) });
  }

  /**
   * A company was selected
   * @param event 
   */
  companyFilter(event: any){
    console.log(event);
    this.mPacking = null;

    if (!event){
      this.detailedGeneralInventory = this.auxDetailedGeneralInventory;
      return;
    }

    this.detailedGeneralInventory = this.auxDetailedGeneralInventory.filter(elem => {
      return elem.company == event.name;
    });

    this.loadPackings(event);
  }

  /**
   * Once a company was selected, loads the packings
   * @param event
   */
  loadPackings(event: any){
    console.log(event);

    let aux =  this.detailedGeneralInventory.filter(elem => {
      return (elem.company == event.name);
    });
 
    this.listOfPackings = aux;
    console.log(this.listOfPackings);
  }

  /**
   * A packing was selected
   * @param event 
   */
  packingFilter(event: any) {
    console.log(event);

    if (!event) {
      this.detailedGeneralInventory = this.auxDetailedGeneralInventory;
      return;
    }

    this.detailedGeneralInventory = this.auxDetailedGeneralInventory.filter(elem => {
      return elem.family_name == event.family_name;
    });
  }









  /**
  * Initial configuration of all collapses
  * @param  Initial state: true(collapsed) or false(expanded)
  */
  setInitialCollapse(state: boolean) {
    this.detailedGeneralInventory.map(o => {
      o.isCollapsed = state;
      return o;
    })
  }
  
  private csvOptions = {
    showLabels: true,
    fieldSeparator: ';'
  };

  downloadExcel(): void {
    console.log('Download on excel');

    let params = {};
    // if (this.selectedSupplier) params['supplier_id'] = this.selectedSupplier._id;
    // if (this.selectedEquipament) params['package_code'] = this.selectedEquipament._id.code;

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

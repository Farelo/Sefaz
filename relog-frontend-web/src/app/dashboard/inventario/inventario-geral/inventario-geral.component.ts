import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../../shared/models/pagination';
import { InventoryLogisticService, AuthenticationService, RackService, SuppliersService, InventoryService, ReportsService, CompaniesService, FamiliesService } from '../../../servicos/index.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import 'jspdf';
import 'jspdf-autotable';
declare var jsPDF: any;

@Component({
  selector: 'app-inventario-geral',
  templateUrl: './inventario-geral.component.html',
  styleUrls: ['./inventario-geral.component.css']
})

export class InventarioGeralComponent implements OnInit {

  public listOfCompanies: any[] = [];
  public mCompany: any = null;

  public listOfRacks: any[] = [];
  public mRack: any = null;

  public detailedGeneralInventory: any[] = [];
  public auxDetailedGeneralInventory: any[] = [];

  public actualPage: number = -1;

  public settings: any = {};


  constructor(
    private reportService: ReportsService,
    private inventoryService: InventoryService,
    protected companiesService: CompaniesService,
    private authenticationService: AuthenticationService,
    private familyService: FamiliesService,
    private auth: AuthenticationService) {

    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
  }

  ngOnInit() {

    this.getSettings();
    this.loadCompanies();
    this.loadDetailedInventory();
  }

  /**
   * Recupera a configuração dos alertas
   */
  getSettings() {

    this.settings = this.authenticationService.currentSettings();
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

      // console.log(JSON.stringify(auxListOfCompanies));

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
  companyFilter(event: any) {
    // console.log(event);
    this.mRack = null;

    if (!event) {
      this.detailedGeneralInventory = this.auxDetailedGeneralInventory;
      return;
    }

    this.detailedGeneralInventory = this.auxDetailedGeneralInventory.filter(elem => {
      return elem.company == event.name;
    });

    this.loadRacks(event);
  }

  /**
   * Once a company was selected, loads the racks
   * @param event
   */
  loadRacks(event: any) {
    // console.log(event);

    let aux = this.detailedGeneralInventory.filter(elem => {
      return (elem.company == event.name);
    });

    this.listOfRacks = aux;
    // console.log(this.listOfRacks);
  }

  /**
   * A rack was selected
   * @param event 
   */
  rackFilter(event: any) {
    // console.log(event);

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

  /**
  * ================================================
  * Downlaod csv file
  */

  private csvOptions = {
    showLabels: true,
    fieldSeparator: ';'
  };

  /**
  * Click to download
  */
  downloadCsv() {

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.detailedGeneralInventory.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, 'Inventario Inventário Geral', this.csvOptions);
  }

  /**
  * Click to download pdf file
  */
  downloadPdf() {
    var doc = jsPDF('l', 'pt');

    // You can use html:
    //doc.autoTable({ html: '#my-table' });

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.detailedGeneralInventory.slice());
    flatObjectData = flatObjectData.map(elem => {
      return [elem.a1, elem.a2, elem.a3, elem.a4, elem.a5, elem.a6, elem.a7, elem.a8, elem.a9, elem.a10, elem.a11, elem.a12];
    });
    
    // console.log(flatObjectData);

    // Or JavaScript:
    doc.autoTable({
      head: [['Fornecedor',
        'Família',
        'Total de Equipamentos do Fornecedor(TEF)',
        'Quantidade nas Plantas(A)',
        'Quantidade no Fornecedor(B)',
        'Quantidade no Transito(C)',
        'Total do Inventário On Line(TIOL = A + B + C)',
        'Diferença(TEF - TIOL)',
        'Atraso de Rota',
        'Local Incorreto',
        'Tempo de Permanência',
        'Embalagem Ausente'
      ]],
      body: flatObjectData
    });

    doc.save('general_inventory.pdf');
  }

  flatObject(mArray: any) {

    //console.log(mArray);

    let plainArray = mArray.map(obj => {
      return {
        a1: obj.company,
        a2: obj.family_name,
        a3: obj.qtd_total,
        a4: obj.qtd_in_owner,
        a5: obj.qtd_in_clients,
        a6: obj.qtd_in_traveling,
        a7: ((obj.qtd_in_owner) + (obj.qtd_in_clients) + (obj.qtd_in_traveling)),
        a8: ((obj.qtd_total) - ((obj.qtd_in_owner) + (obj.qtd_in_clients) + (obj.qtd_in_traveling))),
        a9: (obj.qtd_in_traveling_late == undefined) ? 0 : obj.qtd_in_traveling_late,
        a10: (obj.qtd_in_incorrect_cp == undefined) ? 0 : obj.qtd_in_incorrect_cp,
        a11: (obj.qtd_with_permanence_time_exceeded == undefined) ? 0 : obj.qtd_with_permanence_time_exceeded,
        a12: (obj.qtd_in_traveling_missing == undefined) ? 0 : obj.qtd_in_traveling_missing,
      };
    });
    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any) {
    let cabecalho = {
      a1: 'Fornecedor',
      a2: 'Família',
      a3: 'Total de Equipamentos do Fornecedor(TEF)',
      a4: 'Quantidade nas Plantas(A)',
      a5: 'Quantidade no Fornecedor(B)',
      a6: 'Quantidade no Transito(C)',
      a7: 'Total do Inventário On Line(TIOL = A + B + C)',
      a8: 'Diferença(TEF - TIOL)',
      a9: 'Atraso de Rota',
      a10: 'Local Incorreto',
      a11: 'Tempo de Permanência',
      a12: 'Embalagem Ausente'
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }

}

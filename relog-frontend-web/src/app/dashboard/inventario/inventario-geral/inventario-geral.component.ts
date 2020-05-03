import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../../shared/models/pagination';
import { InventoryLogisticService, AuthenticationService, PackingService, SuppliersService, InventoryService, ReportsService, CompaniesService, FamiliesService } from '../../../servicos/index.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import 'jspdf';
import 'jspdf-autotable';
import { TranslateService } from '@ngx-translate/core';
declare var jsPDF: any;

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

  public settings: any = {};


  constructor(public translate: TranslateService,
    private reportService: ReportsService,
    private inventoryService: InventoryService,
    protected companiesService: CompaniesService,
    private authenticationService: AuthenticationService,
    private familyService: FamiliesService,
    private auth: AuthenticationService) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
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
    this.mPacking = null;

    if (!event) {
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
  loadPackings(event: any) {
    // console.log(event);

    let aux = this.detailedGeneralInventory.filter(elem => {
      return (elem.company == event.name);
    });

    this.listOfPackings = aux;
    // console.log(this.listOfPackings);
  }

  /**
   * A packing was selected
   * @param event 
   */
  packingFilter(event: any) {
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
    new Angular2Csv(flatObjectData, this.translate.instant('INVENTORY.GENERAL_INVENTORY.TITLE'), this.csvOptions);
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
      return [elem.a1, elem.a2, elem.a3, elem.a4, elem.a5, elem.a6, elem.a7, elem.a8, elem.a9, elem.a10, elem.a11, elem.a12, elem.a13, elem.a14, elem.a15];
    });

    // console.log(flatObjectData);

    let headerArray = [
      this.translate.instant('INVENTORY.GENERAL_INVENTORY.PROVIDER'),
      this.translate.instant('INVENTORY.GENERAL_INVENTORY.FAMILY'),
      this.translate.instant('INVENTORY.GENERAL_INVENTORY.TOTAL_ADMINISTRATED'),
      this.translate.instant('INVENTORY.GENERAL_INVENTORY.AT_OWNER_CONTROL_POINT'),

      this.translate.instant('INVENTORY.GENERAL_INVENTORY.AT_ADMINISTRATED_CONTROL_POINT'),
      this.translate.instant('INVENTORY.GENERAL_INVENTORY.TRAVEL_QUANTITY'),
      this.translate.instant('INVENTORY.GENERAL_INVENTORY.ANALYSIS'),
      this.translate.instant('INVENTORY.GENERAL_INVENTORY.TOTAL_ONLINE'),
      this.translate.instant('INVENTORY.GENERAL_INVENTORY.DIFF'),

      this.translate.instant('INVENTORY.GENERAL_INVENTORY.LATE'),
      this.translate.instant('INVENTORY.GENERAL_INVENTORY.INCORRECT_LOCAL'),
      this.translate.instant('INVENTORY.GENERAL_INVENTORY.PERMANENCE_TIME'),
      this.translate.instant('INVENTORY.GENERAL_INVENTORY.ABSENT'),

      this.translate.instant('INVENTORY.GENERAL_INVENTORY.NO_SIGNAL')];

    if (this.settings.enable_perdida) headerArray.push(this.translate.instant('INVENTORY.GENERAL_INVENTORY.LOST'))

    // Or JavaScript:
    doc.autoTable({
      head: [headerArray],
      body: flatObjectData,
      headStyles: {
        fontSize: 5
      },
      bodyStyles: {
        fontSize: 5
      }
    });

    //doc.setFontSize(3);
    doc.save('general_inventory.pdf');
  }

  flatObject(mArray: any) {

    //console.log(mArray);

    let plainArray = mArray.map(obj => {
      let auxObject = {
        a1: obj.company,
        a2: obj.family_name,
        a3: obj.qtd_total,
        a4: obj.qtd_in_owner,
        a5: obj.qtd_in_clients,
        a6: (obj.qtd_in_traveling + obj.qtd_in_traveling_late),
        a7: obj.qtd_in_analysis,
        a8: (obj.qtd_in_owner + obj.qtd_in_clients + (obj.qtd_in_traveling + obj.qtd_in_traveling_late) + obj.qtd_in_analysis),
        a9: (obj.qtd_total - (obj.qtd_in_owner + obj.qtd_in_clients + (obj.qtd_in_traveling + obj.qtd_in_traveling_late) + obj.qtd_in_analysis)),
        a10: (obj.qtd_in_traveling_late == undefined) ? 0 : obj.qtd_in_traveling_late,
        a11: (obj.qtd_in_incorrect_cp == undefined) ? 0 : obj.qtd_in_incorrect_cp,
        a12: (obj.qtd_with_permanence_time_exceeded == undefined) ? 0 : obj.qtd_with_permanence_time_exceeded,
        a13: (obj.qtd_in_traveling_missing == undefined) ? 0 : obj.qtd_in_traveling_missing,
        a14: (obj.qtd_no_signal == undefined) ? 0 : obj.qtd_no_signal,
        a15: (obj.qtd_missing == undefined) ? 0 : obj.qtd_missing,
      };

      if (!this.settings.enable_perdida) delete auxObject.a15;

      return auxObject;
    });

    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any) {
    let cabecalho = {
      a1: this.translate.instant('INVENTORY.GENERAL_INVENTORY.PROVIDER'),
      a2: this.translate.instant('INVENTORY.GENERAL_INVENTORY.FAMILY'),
      a3: this.translate.instant('INVENTORY.GENERAL_INVENTORY.TOTAL_ADMINISTRATED'),
      a4: this.translate.instant('INVENTORY.GENERAL_INVENTORY.AT_OWNER_CONTROL_POINT'),

      a5: this.translate.instant('INVENTORY.GENERAL_INVENTORY.AT_ADMINISTRATED_CONTROL_POINT'),
      a6: this.translate.instant('INVENTORY.GENERAL_INVENTORY.TRAVEL_QUANTITY'),
      a7: this.translate.instant('INVENTORY.GENERAL_INVENTORY.ANALYSIS'),
      a8: this.translate.instant('INVENTORY.GENERAL_INVENTORY.TOTAL_ONLINE'),
      a9: this.translate.instant('INVENTORY.GENERAL_INVENTORY.DIFF'),

      a10: this.translate.instant('INVENTORY.GENERAL_INVENTORY.LATE'),
      a11: this.translate.instant('INVENTORY.GENERAL_INVENTORY.INCORRECT_LOCAL'),
      a12: this.translate.instant('INVENTORY.GENERAL_INVENTORY.PERMANENCE_TIME'),
      a13: this.translate.instant('INVENTORY.GENERAL_INVENTORY.ABSENT'),

      a14: this.translate.instant('INVENTORY.GENERAL_INVENTORY.NO_SIGNAL'),
      a15: this.translate.instant('INVENTORY.GENERAL_INVENTORY.LOST'),
    }

    if (!this.settings.enable_perdida) delete cabecalho.a15;

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }

}

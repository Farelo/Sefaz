import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../servicos/auth.service';
import { ReportsService, FamiliesService } from '../../../servicos/index.service';
import { Pagination } from '../../../shared/models/pagination';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { CompanyType } from '../../../shared/pipes/plantType';
import 'jspdf';
import 'jspdf-autotable';
import { TranslateService } from '@ngx-translate/core';
declare var jsPDF: any;

@Component({
  selector: 'app-inventario-quantidade',
  templateUrl: './inventario-quantidade.component.html',
  styleUrls: ['./inventario-quantidade.component.css'],
})
export class InventarioQuantidadeComponent implements OnInit {

  //dados da tabela
  public listOfQuantity: any[] = [];
  public auxListOfQuantity: any[] = [];

  //paginação
  public listOfQuantityActualPage: number = -1;

  //dados do select
  public listOfFamily: any[] = [];
  public selectedFamily: any = null;

  public qtdTotal: number = 0;


  constructor(public translate: TranslateService,
    private reportService: ReportsService,
    private familyService: FamiliesService,
    private auth: AuthenticationService) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

  ngOnInit() {

    this.loadFamilies();
    this.loadQuantityInventory();
  }

  loadFamilies() {
    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamily = result;
    }, err => console.error(err));
  }

  loadQuantityInventory() {
    this.reportService.getQuantityInventory().subscribe(result => {

      //atualizar dados
      this.listOfQuantity = result;
      this.auxListOfQuantity = result;

      //atualizar quantidades
      this.updateResumeQuantity();
    });
  }

  familySelected(event: any) {

    if (event) {
      this.listOfQuantity = this.auxListOfQuantity.filter(elem => {
        return elem.family_code == event.code
      });

    } else {
      this.listOfQuantity = this.auxListOfQuantity;
    }

    this.updateResumeQuantity();
  }

  updateResumeQuantity() {
    this.qtdTotal = this.listOfQuantity.map(elem => elem.total).reduce(function (accumulator, currentValue) { return accumulator + currentValue }, 0);
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
    let flatObjectData = this.flatObject(this.listOfQuantity.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, this.translate.instant('INVENTORY.QUANTITY.TITLE'), this.csvOptions);
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
    let flatObjectData = this.flatObject(this.listOfQuantity.slice());
    flatObjectData = flatObjectData.map(elem => {
      return [elem.a1, elem.a2, elem.a3, elem.a4, elem.a5, elem.a6, elem.a7];
    });
    // console.log(flatObjectData);

    // Or JavaScript:
    doc.autoTable({
      head: //[['Família', 'Empresa', 'Ponto de controle', 'Tipo', 'Local', 'Min', 'Quantidade', 'Max']],
        [[
          this.translate.instant('INVENTORY.QUANTITY.FAMILY'),
          this.translate.instant('INVENTORY.QUANTITY.COMPANY'),
          this.translate.instant('INVENTORY.QUANTITY.CONTROL_POINT'),
          this.translate.instant('INVENTORY.QUANTITY.TYPE'),
          this.translate.instant('INVENTORY.QUANTITY.MIN'),
          this.translate.instant('INVENTORY.QUANTITY.QUANTITY'),
          this.translate.instant('INVENTORY.QUANTITY.MAX')
        ]],
      body: flatObjectData
    });

    doc.save('quantity.pdf');
  }

  flatObject(mArray: any) {

    //console.log(mArray);

    let transformer = new CompanyType();
    let plainArray = mArray.map(obj => {
      return {
        a1: obj.family_code,
        a2: obj.company,
        a3: obj.control_point_name,
        a4: obj.control_point_type,
        a5: obj.stock_min,
        a6: obj.total,
        a7: obj.stock_max,
      };
    });

    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any) {
    let cabecalho = {
      a1: this.translate.instant('INVENTORY.QUANTITY.FAMILY'),
      a2: this.translate.instant('INVENTORY.QUANTITY.COMPANY'),
      a3: this.translate.instant('INVENTORY.QUANTITY.CONTROL_POINT'),
      a4: this.translate.instant('INVENTORY.QUANTITY.TYPE'),
      a5: this.translate.instant('INVENTORY.QUANTITY.MIN'),
      a6: this.translate.instant('INVENTORY.QUANTITY.QUANTITY'),
      a7: this.translate.instant('INVENTORY.QUANTITY.MAX')
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }
}

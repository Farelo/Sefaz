import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { AuthenticationService } from '../../../servicos/auth.service';
import { SuppliersService, InventoryService, ReportsService, CompaniesService } from '../../../servicos/index.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import 'jspdf';
import 'jspdf-autotable';
import { TranslateService } from '@ngx-translate/core';
declare var jsPDF: any;

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.css']
})
export class FornecedorComponent implements OnInit {

  public listOfCompanies: any[] = [];
  public selectedCompany: any = null;

  public listOfQuantityInSuppliers: any[] = [];
  public auxListOfQuantityInSuppliers: any[] = [];
  public listOfQuantityInSuppliersActualPage: number = -1;

  constructor(public translate: TranslateService,
    private reportsService: ReportsService,
    protected companiesService: CompaniesService,
    private auth: AuthenticationService) { 

      if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
    }

  ngOnInit() {

    this.loadCompanies();
    //this.loadReport();
  }

  /**
   * Método para carregar o select
   */
  loadCompanies() {
    this.companiesService.getAllCompanies().subscribe(result => {
      this.listOfCompanies = result;
    }, error => console.error(error))
  }

  /**
   * Método para carregar a lista
   */
  loadReport(companyId: any){

    this.reportsService.getClientsInventory(companyId).subscribe(result => {
      this.listOfQuantityInSuppliers = result;
    }, err => { console.log(err) });
  }

  /**
   * Um item do select foi selecionado
   */
  companySelected(event: any): void {

    // console.log(event);

    if(event){
      this.loadReport(event._id);

    } else {
      this.listOfQuantityInSuppliers = this.auxListOfQuantityInSuppliers;
    }
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
    let flatObjectData = this.flatObject(this.listOfQuantityInSuppliers.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, this.translate.instant('INVENTORY.PROVIDER.TITLE'), this.csvOptions);
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
    let flatObjectData = this.flatObject(this.listOfQuantityInSuppliers.slice());
    flatObjectData = flatObjectData.map(elem => {
      return [elem.a1, elem.a2, elem.a3, elem.a4, elem.a5];
    });
    console.log(flatObjectData);

    // Or JavaScript:
    //[['Equipamento', 'Empresa Vinculada', 'Planta Atual', 'Local', 'Quantidade']],
    doc.autoTable({
      head: 
      [[
        this.translate.instant('INVENTORY.PROVIDER.PACKING'),
        this.translate.instant('INVENTORY.PROVIDER.LINK'),
        this.translate.instant('INVENTORY.PROVIDER.ACTUAL_SITE'),
        this.translate.instant('INVENTORY.PROVIDER.SITE'),
        this.translate.instant('INVENTORY.PROVIDER.QUANTITY')
      ]],
      body: flatObjectData
    });

    doc.save('table.pdf');
  }

  flatObject(mArray: any) {

    //console.log(mArray);

    let plainArray = mArray.map(obj => {
      return {
        a1: obj.family_code,
        a2: obj.company,
        a3: obj.control_point_name,
        a4: obj.control_point_type,
        a5: obj.qtd
      };
    });

    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any) {
    let cabecalho = {
      a1: this.translate.instant('INVENTORY.PROVIDER.PACKING'),
      a2: this.translate.instant('INVENTORY.PROVIDER.LINK'),
      a3: this.translate.instant('INVENTORY.PROVIDER.ACTUAL_SITE'),
      a4: this.translate.instant('INVENTORY.PROVIDER.SITE'),
      a5: this.translate.instant('INVENTORY.PROVIDER.QUANTITY')
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }

}

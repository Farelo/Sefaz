import { Component, OnInit } from '@angular/core';
import { AuthenticationService, ReportsService } from '../../../servicos/index.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import 'jspdf';
import 'jspdf-autotable';
import { TranslateService } from '@ngx-translate/core';
declare var jsPDF: any;

@Component({
  selector: 'app-geral',
  templateUrl: './geral.component.html',
  styleUrls: ['./geral.component.css']
})
export class GeralComponent implements OnInit {

  //dados da tabela
  public listOfGeneral: any[] = [];
  public auxListOfGeneral: any[] = [];

  //paginação
  public listOfGeneralActualPage: number = -1;

  public isCollapsed = false;

  constructor(public translate: TranslateService,
    private reportService: ReportsService,
    private modalService: NgbModal,
    private auth: AuthenticationService) {

      if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

  ngOnInit() {

    this.getGeneral();
  }

  getGeneral() {

    this.reportService.getGeneral().subscribe(result => {
      this.listOfGeneral = result;
      this.auxListOfGeneral = result;

    },err => console.log(err)); 
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
  downloadCsv(){

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.listOfGeneral.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, 'General', this.csvOptions);
  }

  /**
   * Click to download pdf file
   */
  downloadPdf(){
    var doc = jsPDF('l', 'pt');

    // You can use html:
    //doc.autoTable({ html: '#my-table' });

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.listOfGeneral.slice());
    flatObjectData = flatObjectData.map(elem => {
      return [elem.a1, elem.a2, elem.a3, elem.a4];
    });
    // console.log(flatObjectData);

    // Or JavaScript:
    //head: [['Família', 'Empresa', 'Projeto', 'Quantidade']],
    doc.autoTable({
      head: [[
        this.translate.instant('INVENTORY.GENERAL_FILTER.FAMILY'),
        this.translate.instant('INVENTORY.GENERAL_FILTER.COMPANY'),
        this.translate.instant('INVENTORY.GENERAL_FILTER.PROJECT'),
        this.translate.instant('INVENTORY.GENERAL_FILTER.QUANTITY')
      ]],
      body: flatObjectData
    });

    doc.save('general.pdf');
  }

  flatObject(mArray: any) {
    
    //console.log(mArray);
     let plainArray = mArray.map(obj => {
          return {
            a1: obj.family.code,
            a2: obj.family.company.name,
            a3: obj.project_name == null ? this.translate.instant('INVENTORY.GENERAL_FILTER.NO_PROJECT') :  obj.project_name,
            a4: (obj.packings_quantity >= 0) ? obj.packings_quantity : '-',
          };
        });
      
    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any){
    let cabecalho = {
      a1: this.translate.instant('INVENTORY.GENERAL_FILTER.FAMILY'),
      a2: this.translate.instant('INVENTORY.GENERAL_FILTER.COMPANY'),
      a3: this.translate.instant('INVENTORY.GENERAL_FILTER.PROJECT'),
      a4: this.translate.instant('INVENTORY.GENERAL_FILTER.QUANTITY')
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }

}

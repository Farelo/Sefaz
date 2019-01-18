import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InventoryLogisticService, AuthenticationService, PackingService, SuppliersService, InventoryService, ReportsService } from '../../../servicos/index.service';
import { Pagination } from '../../../shared/models/pagination';
import { ModalInvComponent } from '../../../shared/modal-inv/modal-inv.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
// import 'jspdf';
// import 'jspdf-autotable';
// declare var jsPDF: any;

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

  constructor(private reportService: ReportsService,
    private modalService: NgbModal,
    private auth: AuthenticationService) {

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

  open(packing) {
    const modalRef = this.modalService.open(ModalInvComponent);
    modalRef.componentInstance.packing = packing;
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
    new Angular2Csv(flatObjectData, 'Inventario Geral', this.csvOptions);
  }

  /**
   * Click to download pdf file
   */
  // downloadPdf(){
  //   var doc = jsPDF('l', 'pt');

  //   // You can use html:
  //   //doc.autoTable({ html: '#my-table' });

  //   //Flat the json object to print
  //   //I'm using the method slice() just to copy the array as value.
  //   let flatObjectData = this.flatObject(this.listOfGeneral.slice());
  //   flatObjectData = flatObjectData.map(elem => {
  //     return [elem.a1, elem.a2, elem.a3, elem.a4];
  //   });
  //   // console.log(flatObjectData);

  //   // Or JavaScript:
  //   doc.autoTable({
  //     head: [['Família', 'Empresa', 'Projeto', 'Quantidade']],
  //     body: flatObjectData
  //   });

  //   doc.save('general.pdf');
  // }

  flatObject(mArray: any) {
    
    //console.log(mArray);
     let plainArray = mArray.map(obj => {
          return {
            a1: obj.family.code,
            a2: obj.family.company.name,
            a3: obj.project_name == null ? 'Sem projeto' :  obj.project_name,
            a4: (obj.packings_quantity >= 0) ? obj.packings_quantity : '-',
          };
        });
      
    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any){
    let cabecalho = {
      a1: 'Família',
      a2: 'Empresa',
      a3: 'Projeto',
      a4: 'Quantidade',
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }

}

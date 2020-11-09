import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import {
  AuthenticationService,
  ReportsService,
  FamiliesService,
} from '../../../servicos/index.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { RoundPipe } from '../../../shared/pipes/round';
import 'jspdf';
import 'jspdf-autotable';
declare var jsPDF: any;

@Component({
  selector: 'app-inventario-removido',
  templateUrl: './inventario-removido.component.html',
  styleUrls: ['./inventario-removido.component.css'],
})
export class InventarioRemovidoComponent implements OnInit {
  
  //dados da tabela
  public listOfRemoved: any[] = [];
  public auxlistOfRemoved: any[] = [];

  //paginação
  public listOfRemovedActualPage: number = -1;

  //dados do select
  public listOfFamily: any[] = [];
  public selectedFamily = null;

  constructor(private reportService: ReportsService,
    private familyService: FamiliesService,
    private auth: AuthenticationService) {
    
  }

  ngOnInit() {

    this.loadPackings();
    this.removedInventory();
  }

  removedInventory() {
    
    this.reportService.getBatteryInventory().subscribe(result => {
      this.listOfRemoved = result;
      this.auxlistOfRemoved = result;
    });
  }

  loadPackings() {
    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamily = result; 
    }, err => console.error(err));
  }

  familySelected(event: any){
    
    if(event){
      this.listOfRemoved = this.auxlistOfRemoved.filter(elem => {
        return elem.family_code == event.code
      });

    } else{
      this.listOfRemoved = this.auxlistOfRemoved;
    }
  }
   
  /**
  * Click to download
  */
  private csvOptions = {
   showLabels: true,
   fieldSeparator: ';'
  };

  downloadCsv(){

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.listOfRemoved.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, 'Inventario Equipamento Removido', this.csvOptions);
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
    let flatObjectData = this.flatObject(this.listOfRemoved.slice());
    flatObjectData = flatObjectData.map(elem => {
      return [elem.a1, elem.a2, elem.a3, elem.a4, elem.a5];
    });
    // console.log(flatObjectData);

    // Or JavaScript:
    doc.autoTable({
      head: [['Família', 'Serial', 'Planta Atual', 'Local', 'Removido']],
      body: flatObjectData
    });

    doc.save('removed.pdf');
  }


  flatObject(mArray: any) {
    
    //console.log(mArray);

     let transformer= new RoundPipe();
     let plainArray = mArray.map(obj => {
          return {
            a1: obj.family_code,
            a2: obj.serial,
            a3: obj.current_control_point_name,
            a4: obj.current_control_point_type,
            //a5: obj.
          };
        });
      
    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any){
    let cabecalho = {
      a1: 'Família',
      a2: 'Serial',
      a3: 'Planta Atual',
      a4: 'Local',
      a5: 'Removido'
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }
}

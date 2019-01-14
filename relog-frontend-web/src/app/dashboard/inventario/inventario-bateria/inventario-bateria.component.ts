import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import {
  InventoryLogisticService,
  InventoryService,
  AuthenticationService,
  PackingService,
  ReportsService,
  FamiliesService,
} from '../../../servicos/index.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { RoundPipe } from '../../../shared/pipes/round';

@Component({
  selector: 'app-inventario-bateria',
  templateUrl: './inventario-bateria.component.html',
  styleUrls: ['./inventario-bateria.component.css'],
})
export class InventarioBateriaComponent implements OnInit {
  
  //dados da tabela
  public listOfBattery: any[] = [];
  public auxListOfBattery: any[] = [];

  //paginação
  public listOfBatteryActualPage: number = -1;

  //dados do select
  public listOfFamily: any[] = [];
  public selectedFamily = null;

  constructor(private reportService: ReportsService,
    private familyService: FamiliesService,
    private auth: AuthenticationService) {
    
  }

  ngOnInit() {

    this.loadPackings();
    this.batteryInventory();
  }

  batteryInventory() {
    
    this.reportService.getBatteryInventory().subscribe(result => {
      this.listOfBattery = result;
      this.auxListOfBattery = result;
    });
  }

  loadPackings() {
    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamily = result; 
    }, err => console.error(err));
  }

  familySelected(event: any){
    
    if(event){
      this.listOfBattery = this.auxListOfBattery.filter(elem => {
        return elem.family_code == event.code
      });

    } else{
      this.listOfBattery = this.auxListOfBattery;
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
    let flatObjectData = this.flatObject(this.listOfBattery.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, 'Inventario Equipamento Bateria', this.csvOptions);
  }

  flatObject(mArray: any) {
    
    //console.log(mArray);

    /**
     * Example:
        let plain = mArray.map(obj => {
          return {
            supplierName: obj.supplier.name,
            equipmentCode: obj._id.code,
            quantityTotal: obj.quantityTotal,
            quantityInFactory: obj.quantityInFactory,
            quantityInSupplier: obj.quantityInSupplier,
            quantityTraveling: obj.quantityTraveling,
            quantityProblem: obj.quantityProblem,
            lostObject: obj.quantityProblem == undefined ? 0 : obj.quantityProblem
          };
        });
        return plain;
     */
     let transformer= new RoundPipe();
     let plainArray = mArray.map(obj => {
          return {
            a1: obj.family_code,
            a2: obj.serial,
            a3: obj.current_control_point_name,
            a4: obj.current_control_point_type,
            a5: (obj.battery_percentage !== null) ? transformer.transform(obj.battery_percentage):"Sem Registro",
            a6: obj.battery_level,
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
      a5: 'Bateria',
      a6: 'Nível',
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }
}

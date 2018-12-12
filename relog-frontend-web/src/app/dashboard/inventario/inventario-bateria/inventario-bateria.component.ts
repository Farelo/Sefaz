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
    
}

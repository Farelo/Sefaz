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
import { TranslateService } from '@ngx-translate/core';
declare var jsPDF: any;

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

  constructor(public translate: TranslateService,
    private reportService: ReportsService,
    private familyService: FamiliesService,
    private auth: AuthenticationService) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
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

  familySelected(event: any) {

    if (event) {
      this.listOfBattery = this.auxListOfBattery.filter(elem => {
        return elem.family_code == event.code
      });

    } else {
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

  downloadCsv() {

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.listOfBattery.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, this.translate.instant('INVENTORY.BATTERY_INVENTORY.TITLE'), this.csvOptions);
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
    let flatObjectData = this.flatObject(this.listOfBattery.slice());
    flatObjectData = flatObjectData.map(elem => {
      return [elem.a1, elem.a2, elem.a3, elem.a4, elem.a5, elem.a6];
    });
    // console.log(flatObjectData);

    // Or JavaScript:
    doc.autoTable({
      head: [[
        this.translate.instant('INVENTORY.BATTERY_INVENTORY.FAMILY'),
        this.translate.instant('INVENTORY.BATTERY_INVENTORY.SERIAL'),
        this.translate.instant('INVENTORY.BATTERY_INVENTORY.ACTUAL_SITE'),
        this.translate.instant('INVENTORY.BATTERY_INVENTORY.SITE_TYPE'),
        this.translate.instant('INVENTORY.BATTERY_INVENTORY.BATTERY'),
        this.translate.instant('INVENTORY.BATTERY_INVENTORY.LEVEL')
      ]],
      body: flatObjectData
    });

    doc.save('battery.pdf');
  }


  flatObject(mArray: any) {

    let transformer = new RoundPipe();
    let plainArray = mArray.map(obj => {
      return {
        a1: obj.family_code,
        a2: obj.serial,
        a3: obj.current_control_point_name,
        a4: obj.current_control_point_type,
        a5: (obj.battery_percentage !== null) ? transformer.transform(obj.battery_percentage) : this.translate.instant('INVENTORY.BATTERY_INVENTORY.NO_HISTORY'),
        a6: obj.battery_level,
      };
    });

    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any) {

    let cabecalho = {
      a1: this.translate.instant('INVENTORY.BATTERY_INVENTORY.FAMILY'),
      a2: this.translate.instant('INVENTORY.BATTERY_INVENTORY.SERIAL'),
      a3: this.translate.instant('INVENTORY.BATTERY_INVENTORY.ACTUAL_SITE'),
      a4: this.translate.instant('INVENTORY.BATTERY_INVENTORY.SITE_TYPE'),
      a5: this.translate.instant('INVENTORY.BATTERY_INVENTORY.BATTERY'),
      a6: this.translate.instant('INVENTORY.BATTERY_INVENTORY.LEVEL')
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }
}

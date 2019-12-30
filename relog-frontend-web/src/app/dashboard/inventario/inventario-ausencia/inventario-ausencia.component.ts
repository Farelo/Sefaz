import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { InventoryService, PackingService, AuthenticationService, InventoryLogisticService, FamiliesService, ReportsService, ControlPointTypesService } from '../../../servicos/index.service';
import { AbscenseModalComponent } from '../../../shared/modal-packing-absence/abscense.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { FloatTimePipe } from '../../../shared/pipes/floatTime';
import { LayerModalComponent } from 'app/shared/modal-packing/layer.component';
import 'jspdf';
import 'jspdf-autotable';
import { TranslateService } from '@ngx-translate/core';
declare var jsPDF: any;

@Component({
  selector: 'app-inventario-ausencia',
  templateUrl: './inventario-ausencia.component.html',
  styleUrls: ['./inventario-ausencia.component.css']
})
export class InventarioAusenciaComponent implements OnInit {

  public listOfFamilies: any[];
  public selectedFamily: any = null;

  public listOfSerials: any[] = [];
  public selectedSerial: any = null;

  public listOfAbsent: any[] = [];
  public auxListOfAbsent: any[] = [];
  
  public timeInterval: number = null;

  public actualPage: number = -1;

  constructor(public translate: TranslateService,
    private familyService: FamiliesService,
    private reportService: ReportsService,
    private modalService: NgbModal,
    private auth: AuthenticationService) { }

  ngOnInit() {
    //Loads the table headers
    this.loadTableHeaders();

    this.loadFamilies();
    this.loadLocals();
    this.loadAbsenceInventory();
  }

  /**
   * Loading the families
   */
  loadFamilies(){
    this.familyService.getAllFamilies().subscribe(result => {

      this.listOfFamilies = result;
    }, err => console.error(err));
  }

  /**
   * Loads the serials
   */
  loadSerials(event: any) {

    this.selectedSerial = null;

    // console.log(aux);
    this.listOfSerials = this.listOfAbsent;
  }

  /**
   * Fill the select of locals
   */
  loadLocals() {

  }

  loadAbsenceInventory() {
    this.reportService.getAbsentInventory().subscribe(result => {
      this.listOfAbsent = result;
      this.auxListOfAbsent = result;
    }, err => { console.log(err) });
  }

  /**
   * Filtros
   */
  familyFilter(event: any){
    
    if(!event) {
      this.listOfSerials = [];
      this.selectedSerial = null;
      return;
    }

    let aux = this.auxListOfAbsent.filter(elem => {
      return elem.family.code == event.code;
    });

    this.listOfAbsent = aux;

    this.loadSerials(event);
  }

  serialFilter(event: any) {

    if (!event) {
      this.selectedSerial = null;
      this.familyFilter(this.selectedFamily);
      return;
    }

    let aux = this.auxListOfAbsent.filter(elem => {
      return ((elem.family.code == event.family.code) && (elem.serial == event.serial));
    });

    this.listOfAbsent = aux;

    this.intervalFilter();
  }

  intervalFilter(){
    
    if (this.timeInterval){
      let aux = this.listOfAbsent.filter(elem => {
        return (elem.absent_time_in_hours == this.timeInterval);
      });

      this.listOfAbsent = aux;
    }
  }

  applyGeneralFilter(){
    
    if (!this.selectedFamily) {
      this.listOfSerials = [];
      this.selectedSerial = null;
    }

    let aux = this.auxListOfAbsent.filter(elem => {
      
      let bFamily = (this.selectedFamily == null ? true : (elem.family.code == this.selectedFamily.code));
      let bSerial = (this.selectedSerial == null ? true : (elem.serial == this.selectedSerial.serial));
      let bInterval = (this.timeInterval == null ? true : (elem.absent_time_in_hours <= this.timeInterval));

      return (bFamily && bSerial && bInterval);
    });

    this.listOfAbsent = aux;
  }


  openAbsence(packing) {
    
    const modalRef = this.modalService.open(LayerModalComponent, {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'modal-xl',
    });
    
    packing.tag = packing.tag.code;
    packing.family_code = packing.family.code;
    
    modalRef.componentInstance.packing = packing;
  }

 /**
   * 
   * Ordenação da tabela
   */ 
  public headers: any = [];
  public sortStatus: any = ['asc', 'desc'];
  public sort: any = {
    name: '',
    order: ''
  };

  loadTableHeaders() {
    this.headers.push({ label: this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.FAMILY'), name: 'family.code' });
    this.headers.push({ label: this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.SERIAL'), name: 'serial' });
    this.headers.push({ label: this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.TAG'), name: 'tag.code' });

    this.headers.push({ label: this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.LAST_SITE'), name: 'last_event_record.control_point.name'});
    this.headers.push({ label: this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.ABSENT_TIME'), name: 'absent_time_in_hours' });
  }

  headerClick(item: any) {
    this.sort.name = item.name;
    this.sort.order = this.sortStatus[(this.sortStatus.indexOf(this.sort.order) + 1) % 2];

    this.listOfAbsent  = this.customSort(this.listOfAbsent , item.name.split("."), this.sort.order);
  }

  /**
   * 
   * @param array     All items.
   * @param keyArr    Array with attribute path, if exists.
   * @param reverse   optional. 1 if ascendent, -1 else.
   */
  customSort(array: any[], keyArr: any[], reverse = 'asc') {
    var sortOrder = 1;
    if (reverse == 'desc') sortOrder = -1;

    return array.sort(function (a, b) {
      var x = a, y = b;
      for (var i = 0; i < keyArr.length; i++) {
        x = (x[keyArr[i]] !== undefined) ? x[keyArr[i]] : "";
        y = (y[keyArr[i]] !== undefined) ? y[keyArr[i]] : "";
      }
      return sortOrder * ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
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
    let flatObjectData = this.flatObject(this.listOfAbsent.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.ABSENT_REPORT_NAME'), this.csvOptions);
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
    let flatObjectData = this.flatObject(this.listOfAbsent.slice());
    flatObjectData = flatObjectData.map(elem => {
      return [elem.a1, elem.a2, elem.a3, elem.a4, elem.a5];
    });
    console.log(flatObjectData);

    // Or JavaScript:
    doc.autoTable({
      head:  [[
        this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.FAMILY'),
        this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.SERIAL'),
        this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.TAG'),
        this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.LAST_SITE'),
        this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.ABSENT_TIME')
      ]],
      body: flatObjectData
    });

    doc.save('absent.pdf');
  }

  flatObject(mArray: any) {
    
     const transformer = new FloatTimePipe();   
     let plainArray = mArray.map(obj => {
          return {
            a1: obj.family.code,
            a2: obj.serial,
            a3: obj.tag.code,
            a4: obj.last_event_record ? obj.last_event_record.control_point.name : this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.NO_HISTORY'),
            a5: obj.absent_time_in_hours !== '-' ? transformer.transform(obj.absent_time_in_hours) : this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.NO_HISTORY'),
          };
        });
      
    // As my array is already flat, I'm just returning it.
    return plainArray;
  }
  //this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.FAMILY')
  addHeader(mArray: any){
    let cabecalho = {
      a1: this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.FAMILY'),
      a2: this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.SERIAL'),
      a3: this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.TAG'),
      a4: this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.LAST_SITE'),
      a5: this.translate.instant('INVENTORY.ABSENT_TIME_INVENTORY.ABSENT_TIME')
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }
}


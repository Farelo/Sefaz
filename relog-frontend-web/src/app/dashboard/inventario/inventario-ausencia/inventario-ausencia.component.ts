import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { InventoryService, PackingService, AuthenticationService, InventoryLogisticService, FamiliesService, ReportsService, ControlPointTypesService } from '../../../servicos/index.service';
import { AbscenseModalComponent } from '../../../shared/modal-packing-absence/abscense.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { FloatTimePipe } from '../../../shared/pipes/floatTime';
import { LayerModalComponent } from 'app/shared/modal-packing/layer.component';
// import 'jspdf';
// import 'jspdf-autotable';
// declare var jsPDF: any;


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
  
  // public allTypes: any[] = [];
  // public selectedType: any = null;
  
  public timeInterval: number = null;

  public actualPage: number = -1;

  constructor( 
    private familyService: FamiliesService,
    private reportService: ReportsService,
    private modalService: NgbModal,
    private auth: AuthenticationService) {

  }

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
    //console.log(event);
    
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
    //this.intervalFilter();
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

    //console.log(aux);
    this.listOfAbsent = aux;

    this.intervalFilter();
  }

  intervalFilter(){

    //console.log(this.timeInterval);
    
    if (this.timeInterval){
      let aux = this.listOfAbsent.filter(elem => {
        return (elem.absent_time_in_hours == this.timeInterval);
      });

      this.listOfAbsent = aux;
    }
  }

  applyGeneralFilter(){

    // console.log('apply filter');
    // console.log(this.selectedFamily);
    // console.log(this.selectedSerial);
    // console.log(this.timeInterval);
    // console.log(this.selectedType);
    
    if (!this.selectedFamily) {
      this.listOfSerials = [];
      this.selectedSerial = null;
      //return;
    }

    let aux = this.auxListOfAbsent.filter(elem => {
      
      let bFamily = (this.selectedFamily == null ? true : (elem.family.code == this.selectedFamily.code));
      let bSerial = (this.selectedSerial == null ? true : (elem.serial == this.selectedSerial.serial));
      let bInterval = (this.timeInterval == null ? true : (elem.absent_time_in_hours <= this.timeInterval));
      // let bLocal = (this.selectedType == null ? true : (elem.last_event_record.control_point.type == this.selectedType._id));

      //console.log(`${bFamily}, ${bSerial}, ${bInterval}` )

      return (bFamily && bSerial && bInterval);
    });

    //console.log('aux.length: ' + aux.length);

    this.listOfAbsent = aux;
  }


  openAbsence(packing) {
    // const modalRef = this.modalService.open(AbscenseModalComponent, { backdrop: "static", size: "lg" });
    // modalRef.componentInstance.packing = packing;
    const modalRef = this.modalService.open(LayerModalComponent, {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'modal-xl',
    });
    
    packing.tag = packing.tag.code;
    packing.family_code = packing.family.code;
    
    packing.current_control_point_name = packing.last_event_record.control_point.name;
    
    
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
    this.headers.push({ label: 'Família', name: 'family.code' });
    this.headers.push({ label: 'Serial', name: 'serial' });
    this.headers.push({ label: 'Tag', name: 'tag.code' });

    this.headers.push({ label: 'Última Planta Conhecida', name: 'last_event_record.control_point.name'});
    this.headers.push({ label: 'Tempo de Ausência', name: 'absent_time_in_hours' });

    //console.log('this.headers: ' + JSON.stringify(this.headers));
  }

  headerClick(item: any) {
    this.sort.name = item.name;
    this.sort.order = this.sortStatus[(this.sortStatus.indexOf(this.sort.order) + 1) % 2];

    // console.log('---');
    // console.log('this.sort: ' + JSON.stringify(this.sort));

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

    // console.log('array.length: ' + array.length);
    // console.log('keyArr: ' + keyArr);
    // console.log('sortOrder: ' + sortOrder);

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
    new Angular2Csv(flatObjectData, 'Inventario Equipamento Tempo de Ausência', this.csvOptions);
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
      head: [['Família', 'Serial', 'Tag', 'Última Planta Conhecida', 'Tempo de Ausência']],
      body: flatObjectData
    });

    doc.save('absent.pdf');
  }

  flatObject(mArray: any) {
    
    //console.log(mArray);

     const transformer = new FloatTimePipe();   
     let plainArray = mArray.map(obj => {
          return {
            a1: obj.family.code,
            a2: obj.serial,
            a3: obj.tag.code,
            a4: obj.last_event_record ? obj.last_event_record.control_point.name : 'Sem histórico',
            a5: obj.absent_time_in_hours !== '-' ? transformer.transform(obj.absent_time_in_hours) : 'Sem histórico',
          };
        });
      
    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any){
    let cabecalho = {
      a1: 'Família',
      a2: 'Serial',
      a3: 'Tag',
      a4: 'Última Planta Conhecida',
      a5: 'Tempo de Ausência',
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }
}


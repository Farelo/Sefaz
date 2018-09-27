import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PackingService, PlantsService, LogisticService, SuppliersService, SettingsService, AlertsService} from '../../servicos/index.service';
import { DatepickerModule, BsDatepickerModule, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { MeterFormatter } from '../pipes/meter_formatter';
import { NouiFormatter } from 'ng2-nouislider';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
defineLocale('pt-br', ptBrLocale); 

@Component({
  selector: 'app-alerta',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerModalComponent implements OnInit {

  //Show package details
  public detailsIsCollapsed = true;
  public message = '';

  /*
   * DataPicker
   */
  datePickerConfig = new BsDaterangepickerConfig(); //Configurations
  public initialDate: Date;  //Initial date
  public finalDate: Date;    //Initial date

  /*
   * Accuracy
   */
  public accuracyRange: any = 1000;
  incrementRange(){
    this.accuracyRange = parseInt(this.accuracyRange) + 10;
    this.rangechanged();
  }

  decrementRange() {
    this.accuracyRange = parseInt(this.accuracyRange) - 10;
    this.rangechanged();
  }

  rangechanged(){
    console.log('rangechanged');

    this.updatePaths();
    // this.getLastPostition();
  }

  @Input() packing;
  public path = [];
  public center: any;
  public markers = [];
  public marker = {
    display: true,
    lat: null,
    lng: null,
    start: null,
    end: null,
    battery: null,
    accuracy: null
  };
  public lastPosition: any;

  public plants = [];
  public plant = {
    display: true,
    lat: null,
    lng: null,
    name: null,
    location: null
  };

  public logistics = [];
  public logistic = {
    display: true,
    name: null
  }

  public suppliers = [];
  supplier = {
    display: true,
    name: null,
    lat: null,
    lng: null,
  };

  public settings: any;

  public showLastPosition: boolean = false;

  public showControlledPlants: boolean = true;
  toggleShowControlledPlants(){
    this.showControlledPlants = !this.showControlledPlants;
  }

  constructor(
    public activeLayer: NgbActiveModal,
    private plantsService: PlantsService,
    private logisticService: LogisticService,
    private supplierService: SuppliersService,
    private packingService: PackingService,
    private settingsService: SettingsService,
    private alertService: AlertsService,
    private localeService: BsLocaleService) {

      defineLocale('pt-br', ptBrLocale);
      this.localeService.use('pt-br');

      //Initialize 7 days before now
      let sub = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
      this.initialDate = new Date(sub);
      this.finalDate = new Date();

      this.datePickerConfig.showWeekNumbers = false;
      this.datePickerConfig.displayMonths = 1;
      this.datePickerConfig.containerClass = 'theme-dark-blue';
  }

  ngOnInit() {
    
    //console.log('[layer.component] this.packing: ' + JSON.stringify(this.packing));

    this.getPlantRadius();
    this.getFilteredPositions(this.packing.code_tag, this.initialDate.getTime(), this.finalDate.getTime(), 32000);
    this.getPlants();
    this.getSuppliers();
    this.getLogisticOperators();
    this.getAlert();
  }
  
  /**
   * If the user came from Alert screen, then the packing.alertCode contains the alert status code.
   * If not, trye to retrieve an existing alert status code.
   */
  getAlert(){
    
    if (this.packing.alertCode == undefined) {
      this.alertService.retrievePackingAlert(this.packing._id).subscribe(response => {
        
        if (response.data.length > 0) {
          let result = response.data[0];
          this.packing.alertCode = result.status;

        } else {
          this.packing.alertCode = 0;
        }
      })
      
    }
  }

  getPlantRadius(){
    this.settingsService.retrieve().subscribe(response => {
      let result = response.data[0];
      this.settings = result;
      this.settings.range_radius = this.settings.range_radius * 1000;
    })
  }

  onFirstDateChange(newDate: Date) { 
    if (newDate !== null && this.finalDate !== null ){
      newDate.setHours(0, 0, 0, 0);
      this.getFilteredPositions(this.packing.code_tag, newDate.getTime(), this.finalDate.getTime(), 32000);
    }
  }

  onFinalDateChange(newDate: Date) { 
    
    if (this.initialDate !== null && newDate !== null )
      this.getFilteredPositions(this.packing.code_tag, this.initialDate.getTime(), newDate.getTime(), 32000);
  }
  

  /**
   * Get the package positions with the filter applied
   */
  getFilteredPositions(codeTag: string, startDate: any, finalDate: any, accuracy: any){

    let normalizeStartDate = new Date(startDate);
    normalizeStartDate.setHours(0, 0, 0, 0);

    let normalizeEndDate = new Date(finalDate);
    normalizeEndDate.setHours(23, 59, 59, 0);

    //console.log('[getFilteredPositions] codeTag, startDate, finalDate: ' + codeTag + ", " + normalizeStartDate.getTime() + ", " + normalizeEndDate.getTime());

    this.packingService.getFilteredPositions(codeTag, normalizeStartDate.getTime(), normalizeEndDate.getTime()).subscribe(result => {
      
      this.center = result.data.positions[0];
      this.markers = result.data.markers;

      this.markers.map((elem, index) => { 
        elem.latLng = new google.maps.LatLng(elem.position[0], elem.position[1]);
        return elem;
      });

      this.updatePaths();

      // console.log('[getFilteredPositions] result: ' + JSON.stringify(result));
      // console.log('[getFilteredPositions] path: ' + JSON.stringify(this.path));
      // console.log('[getFilteredPositions] markers: ' + JSON.stringify(this.markers));
      // console.log('lastPosition: ' + JSON.stringify(this.lastPosition));
    });
  }

  /*
   * Plants
   */
  getPlants() {
    this.plantsService.retrieveAll().subscribe(result => {
      this.plants = result.data;

      this.plants.map(e => { 
        e.latLng = new google.maps.LatLng(e.lat, e.lng);
        return e;
      });
    });
  }

  /*
   * Logistic operator
   */
  getLogisticOperators() {
    this.logisticService.listLogistic().subscribe(result => {
      this.logistics = result.data;

      this.logistics.map(e => { 
        e.latLng = new google.maps.LatLng(e.plant.lat, e.plant.lng);
        return e;
      })
      //console.log('logistics: ' + JSON.stringify(this.logistics));
    })
  }

  getSuppliers(){
    this.supplierService.retrieveAll().subscribe(result => {
      this.suppliers = result.data;

      this.suppliers.map(e => { 
        e.latLng = new google.maps.LatLng(e.plant.lat, e.plant.lng);
        return e;
      })
      //console.log('suppliers: ' + JSON.stringify(this.suppliers));
    })
  }

  clicked(_a, opt) {
    var marker = _a.target; 
    
    this.marker.lat = marker.getPosition().lat();
    this.marker.lng = marker.getPosition().lng();
    this.marker.start = opt.start;
    this.marker.battery = opt.battery;
    this.marker.end = opt.end;
    this.marker.accuracy = opt.accuracy;

    this.startWindow(marker);
  }

  clickedPlant(_a, opt) {
    var p = _a.target;
    this.plant.lat = p.lat;
    this.plant.lng = p.lng;
    this.plant.name = opt.plant_name;
    this.plant.location = opt.location;

    this.clickedPlantDetail(p);
  }

  clickedSupplier(_a, opt){
    var s = _a.target;
    //console.log('opt: ' + JSON.stringify(opt));

    this.supplier.lat = opt.plant.lat;
    this.supplier.lng = opt.plant.lng;
    this.supplier.name = opt.plant.plant_name;

    this.clickedSupplierDetail(s);
  }

  clickedLogistic(_a, opt) { 
    var l = _a.target;
    //console.log('opt: ' + JSON.stringify(opt));
    
    this.logistic.name = opt.plant.plant_name;
    this.clickedLogisticDetail(l);
  }

  /*
   * Info window 
   */
  clickedPlantDetail(plant) {
    plant.nguiMapComponent.openInfoWindow('pw', plant);
    // var iwOuter = $('.gm-style-iw');
    // iwOuter.children(':nth-child(1)').css({ 'width': '100%' });
    // var iwCloseBtn = iwOuter.next();
    // iwCloseBtn.css({
    //   'right': '11px',
    //   'top': '17px',
    //   'background-repeat': 'no-repeat',
    //   'background-position': 'center',
    //   'background-image': 'url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTUwNS45NDMsNi4wNThjLTguMDc3LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDksMEw2LjA1OCw0NzYuNjkzYy04LjA3Nyw4LjA3Ny04LjA3NywyMS4xNzIsMCwyOS4yNDkgICAgQzEwLjA5Niw1MDkuOTgyLDE1LjM5LDUxMiwyMC42ODMsNTEyYzUuMjkzLDAsMTAuNTg2LTIuMDE5LDE0LjYyNS02LjA1OUw1MDUuOTQzLDM1LjMwNiAgICBDNTE0LjAxOSwyNy4yMyw1MTQuMDE5LDE0LjEzNSw1MDUuOTQzLDYuMDU4eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTUwNS45NDIsNDc2LjY5NEwzNS4zMDYsNi4wNTljLTguMDc2LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDgsMGMtOC4wNzcsOC4wNzYtOC4wNzcsMjEuMTcxLDAsMjkuMjQ4bDQ3MC42MzYsNDcwLjYzNiAgICBjNC4wMzgsNC4wMzksOS4zMzIsNi4wNTgsMTQuNjI1LDYuMDU4YzUuMjkzLDAsMTAuNTg3LTIuMDE5LDE0LjYyNC02LjA1N0M1MTQuMDE4LDQ5Ny44NjYsNTE0LjAxOCw0ODQuNzcxLDUwNS45NDIsNDc2LjY5NHoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)'
    // });
    // iwCloseBtn.children(':nth-child(1)').css({ 'display': 'none' });
  }

  clickedSupplierDetail(supply) {
    supply.nguiMapComponent.openInfoWindow('sw', supply);
    
  }

  clickedLogisticDetail(supply) {
    supply.nguiMapComponent.openInfoWindow('lw', supply);
    
  }

  startWindow(marker) {
    marker.nguiMapComponent.openInfoWindow('iw', marker);
    
  }

  getPosition(event: any) {
  }



  /**
   * ///////////////////////////////////////
   * Util
   */
  parseToLatLng(s1, s2){
    return new google.maps.LatLng(s1, s2);
  }
  
  isInsideRange(r:any){
    return r <= this.accuracyRange;
  }

  /**
   * This method updates the array 'path' with markers that satisfies the given accuracy.
   */
  rangedMarkers = [];
  updatePaths(){
    this.path = [];
    
    // 
    this.rangedMarkers = this.markers.filter(elem => {
      return elem.accuracy <= this.accuracyRange;
    });
    
    this.rangedMarkers.forEach(m =>{
      if(m.accuracy <= this.accuracyRange){
        this.path.push({ "lat": m.position[0], "lng": m.position[1]});
      }
    });

    this.getLastPostition();

    // console.log('-');
    // console.log('rangedMarkers: ' + JSON.stringify(this.rangedMarkers));
    // console.log('rangedMarkers: ' + JSON.stringify(this.path));
    // console.log('this.markers: ' + JSON.stringify(this.markers));
    // console.log('-');
  }
  
  /**
   * This method updates the array 'path' with markers that satisfies the given accuracy.
   */
  getLastPostition() {
    //console.log('getLastPostition');

    if (this.rangedMarkers.length>0){
      this.lastPosition = this.rangedMarkers[this.rangedMarkers.length - 1];
      this.center = this.lastPosition.latLng;

    }else{
      this.lastPosition = null;
    }
    //console.log('lastPosition: ' + JSON.stringify(this.lastPosition));
    //console.log('center: ' + JSON.stringify(this.center));
  }

  getPin(){
    let pin = null;
    let alertCode = this.packing.alertCode;

    switch (alertCode) {
      case 1:
        pin = { url: '../../../assets/images/pin_ausente.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 2:
        pin = { url: '../../../assets/images/pin_incorreto.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 3:
        pin = { url: '../../../assets/images/pin_bateria.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 4:
        pin = { url: '../../../assets/images/pin_atrasado.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 5:
        pin = { url: '../../../assets/images/pin_permanencia.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 6:
        pin = { url: '../../../assets/images/pin_perdido.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      default:
        pin = { url: '../../../assets/images/pin_normal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;
    }   
    return pin;
  }

  getPinWithAlert(i: number) {
    let pin = null;
    let alertCode = this.packing.alertCode;

    switch (alertCode){
      case 1:
        pin = { url: '../../../assets/images/pin_ausente.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_ausente_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_ausente_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case 2:
        pin = { url: '../../../assets/images/pin_incorreto.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_incorreto_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_incorreto_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case 3:
        pin = { url: '../../../assets/images/pin_bateria.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_bateria_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_bateria_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case 4:
        pin = { url: '../../../assets/images/pin_atrasado.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_atrasado_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_atrasado_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case 5:
        pin = { url: '../../../assets/images/pin_permanencia.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_permanencia_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_permanencia_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;
      
      case 5:
        pin = { url: '../../../assets/images/pin_perdido.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_perdido_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_perdido_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      default:
        pin = { url: '../../../assets/images/pin_normal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_normal_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_normal_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;
    }
    
    return pin;
  }

  getRadiusWithAlert(){
    let pin = "#027f01";
    let alertCode = this.packing.alertCode;

    switch (alertCode) {
      case 1:
        pin = "#ef5562";
        break;

      case 2:
        pin = "#f77737";
        break;

      case 3:
        pin = "#f8bd37";
        break;

      case 4:
        pin = "#4dc9ff";
        break;

      case 5:
        pin = "#4c7bff";
        break;
    }

    return pin;
  }
}

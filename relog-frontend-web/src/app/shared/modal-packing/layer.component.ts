import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PackingService, PlantsService, LogisticService, SuppliersService, SettingsService, AlertsService, AuthenticationService, DevicesService, ControlPointsService } from '../../servicos/index.service';
import { DatepickerModule, BsDatepickerModule, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { MeterFormatter } from '../pipes/meter_formatter';
import { NouiFormatter } from 'ng2-nouislider';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { constants } from 'environments/constants';
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

  @Input() packing;
  public mPacking: any;

  public path = [];
  public center: any = new google.maps.LatLng(0, 0);
  public markers = [];
  public marker = {
    display: true,
    lat: null,
    lng: null,
    messageDate: null,
    end: null,
    battery: null,
    accuracy: null
  };
  public lastPosition: any;

  public controlPoints: any[] = [];
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

  public settings: any = {};

  public showLastPosition: boolean = false;

  public showControlledPlants: boolean = false;

  public isLoading = true;

  constructor(
    public activeLayer: NgbActiveModal,
    private controlPointsService: ControlPointsService,
    private packingService: PackingService,
    private deviceService: DevicesService,
    private authenticationService: AuthenticationService,
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

    console.log('[layer.component] this.packing: ' + JSON.stringify(this.packing));

    this.getPacking();

    //Get the plant radius in the settings
    this.getPlantRadius();

    //get all point according the given filter
    let initialD = this.formatDate(this.initialDate);
    let finalD = this.formatDate(this.finalDate, true);

    // console.log(this.initialDate);
    // console.log(this.finalDate);
    // console.log(initialD);
    // console.log(finalD);

    this.getFilteredPositions(this.packing.tag, initialD, finalD, 32000);

    this.getPlants();
    // this.getSuppliers();
    // this.getLogisticOperators();
    //this.getAlert();
  }

  getPacking() {
    this.packingService.getPacking(this.packing._id).subscribe(response => {
      this.mPacking = response;
      //console.log(this.mPacking);
    });
  }

  getPlantRadius() {

    let currentSetting = this.authenticationService.currentSettings();
    this.settings.range_radius = currentSetting.range_radius;
  }

  /**
   * If the user came from Alert screen, then the packing.current_state contains the alert status code.
   * If not, trye to retrieve an existing alert status code.
   */
  getAlertCode() {

    let result: number = 0;

    switch (this.packing.current_state) {
      case constants.ALERTS.ANALISYS:
        result = 0;
        break;

      case constants.ALERTS.ABSENT:
        result = 1;
        break;

      case constants.ALERTS.INCORRECT_LOCAL:
        result = 2;
        break;

      case constants.ALERTS.LOW_BATTERY:
        result = 3;
        break;

      case constants.ALERTS.LATE:
        result = 4;
        break;

      case constants.ALERTS.PERMANENCE_TIME:
        result = 5;
        break;

      case constants.ALERTS.NO_SIGNAL:
        result = 6;
        break;

      case constants.ALERTS.MISSING:
        result = 7;
        break;

      default:
        result = 0;
    }

    return result;
  }

  onFirstDateChange(newDate: Date) {


    if (newDate !== null && this.finalDate !== null) {

      this.isLoading = true;
      let initialD = this.formatDate(newDate);
      let finalD = this.formatDate(this.finalDate, true);
      this.getFilteredPositions(this.packing.tag, initialD, finalD, 32000);
    }
  }

  onFinalDateChange(newDate: Date) {

    if (this.initialDate !== null && newDate !== null) {

      this.isLoading = true;
      let initialD = this.formatDate(this.initialDate);
      let finalD = this.formatDate(newDate, true);
      this.getFilteredPositions(this.packing.tag, initialD, finalD, 32000);
    }
  }

  /**
   * Get the package positions with the filter applied
   * @param codeTag Device tag code
   * @param startDate Date on format yyyy--mm-dd
   * @param finalDate Date on format yyyy--mm-dd
   * @param accuracy Integer value in meters (m)
   */
  getFilteredPositions(codeTag: string, startDate: any = null, finalDate: any = null, accuracy: any = null) {

    this.deviceService.getFilteredPositions(codeTag, startDate, finalDate, accuracy).subscribe((result: any[]) => {

      if (result.length > 1) {
        //centraliza o mapa
        this.center = new google.maps.LatLng(result[result.length - 1].latitude, result[result.length - 1].longitude);

        //guarda todas as posições
        this.markers = result;

        //add um atributo latLng
        this.markers.map((elem, index) => {
          elem.latLng = new google.maps.LatLng(elem.latitude, elem.longitude);
          return elem;
        });

        this.markers = this.markers.reverse();

        //atualiza o path
        this.updatePaths();

      } else {

        this.isLoading = false;
      }

      this.getResultQuantity();

      // console.log('[getFilteredPositions] result: ' + JSON.stringify(result));
      // console.log('[getFilteredPositions] path: ' + JSON.stringify(this.path));
      // console.log('[getFilteredPositions] markers: ' + JSON.stringify(this.markers));
      // console.log('lastPosition: ' + JSON.stringify(this.lastPosition));
    });
  }

  /*
  * Accuracy
  */
  public accuracyRange: any = 1000;
  incrementRange() {
    this.accuracyRange = parseInt(this.accuracyRange) + 10;
    this.rangechanged();
  }

  decrementRange() {
    this.accuracyRange = parseInt(this.accuracyRange) - 10;
    this.rangechanged();
  }

  rangechanged() {
    // console.log('rangechanged');

    this.updatePaths();
    // this.getLastPostition();
  }


  /*
   * Plants
   */
  public listOfCircleControlPoints: any;
  public listOfPolygonControlPoints: any;

  getPlants() {
    this.controlPointsService.getAllControlPoint().subscribe(result => {
      this.controlPoints = result;

      // this.controlPoints.map(e => {
      //   e.latLng = new google.maps.LatLng(e.lat, e.lng);
      //   return e;
      // });

      this.listOfCircleControlPoints = result
        .filter(elem => elem.geofence.type == 'c')
        .map(elem => {
          elem.position = (new google.maps.LatLng(elem.geofence.coordinates[0].lat, elem.geofence.coordinates[0].lng));
          return elem;
        });

      this.listOfPolygonControlPoints = result
        .filter(elem => elem.geofence.type == 'p')
        .map(elem => {

          let lat = elem.geofence.coordinates.map(p =>  p.lat);
          let lng = elem.geofence.coordinates.map(p =>  p.lng);

          elem.position = {
            lat: (Math.min.apply(null, lat) + Math.max.apply(null, lat))/2,
            lng: (Math.min.apply(null, lng) + Math.max.apply(null, lng))/2
          }

          return elem;
        });

    });
  }


  clicked(_a, opt) {
    var marker = _a.target;

    this.marker.lat = marker.getPosition().lat();
    this.marker.lng = marker.getPosition().lng();
    this.marker.messageDate = opt.message_date_timestamp;
    this.marker.battery = this.packing.battery_percentage;
    this.marker.end = opt.end;
    this.marker.accuracy = opt.accuracy;

    this.startWindow(marker);
  }

  clickedPlant(_a, opt) {
    var p = _a.target;
    this.plant.lat = p.lat;
    this.plant.lng = p.lng;
    this.plant.name = opt.name;
    // this.plant.location = opt.location;

    this.clickedPlantDetail(p);
  }

  clickedSupplier(_a, opt) {
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
  getResultQuantity(): string {
    let result = '';

    //console.log('this.path.length: ' + this.path.length);

    if (this.path.length == 0)
      result = "Sem resultados";

    if (this.path.length == 1)
      result = "1 resultado encontrado";

    if (this.path.length > 1)
      result = `${this.path.length} resultados encontrados`;

    return result;
  }

  toggleShowControlledPlants() {
    this.showControlledPlants = !this.showControlledPlants;
  }

  parseToLatLng(s1, s2) {
    return new google.maps.LatLng(s1, s2);
  }

  isInsideRange(r: any) {
    return r <= this.accuracyRange;
  }

  /**
   * This method updates the array 'path' with markers that satisfies the given accuracy.
   */
  rangedMarkers = [];
  updatePaths() {
    this.path = [];

    // 
    this.rangedMarkers = this.markers.filter(elem => {
      return elem.accuracy <= this.accuracyRange;
    });

    this.rangedMarkers.forEach(elem => {
      if (elem.accuracy <= this.accuracyRange) {
        this.path.push({ "lat": elem.latitude, "lng": elem.longitude });
      }
    });

    this.getLastPostition();

    // console.log('-');
    // console.log('rangedMarkers: ' + JSON.stringify(this.rangedMarkers));
    // console.log('rangedMarkers: ' + JSON.stringify(this.path));
    // console.log('this.markers: ' + JSON.stringify(this.markers));
    // console.log('-');
  }

  lastPositionClicked(event: any){
    // console.log('event');
    // console.log(event);

    // console.log('lastPositionClicked');
    // console.log(this.showLastPosition);

    if (!this.showLastPosition){
      this.center = null;
      this.getLastPostition();
    }
  }

  /**
   * This method updates the array 'path' with markers that satisfies the given accuracy. 
   */
  getLastPostition() {
    //console.log('getLastPostition');

    if (this.rangedMarkers.length > 0) {
      this.lastPosition = this.rangedMarkers[this.rangedMarkers.length - 1];
      // console.log(this.lastPosition);

      //this.center = this.lastPosition.latLng;
      this.center = (new google.maps.LatLng(this.lastPosition.latitude, this.lastPosition.longitude));

    } else {
      this.lastPosition = null;
    }

    this.isLoading = false;
    //console.log('lastPosition: ' + JSON.stringify(this.lastPosition));
    // console.log('center: ' + JSON.stringify(this.center));
  }

  formatDate(date: any, endDate: boolean = false) {
    
    // console.log(endDate);
    // console.log(date);

    let d = date;
    let result = 0;

    if (!endDate) {
      d.setHours(0, 0, 0, 0);
      //d = new Date(d.getTime() + d.getTimezoneOffset() * 60000); //offset to user timezone
      result = d.getTime() / 1000;

    } else {
      d.setHours(23, 59, 59, 0);
      //d = new Date(d.getTime() + d.getTimezoneOffset() * 60000); //offset to user timezone
      result = d.getTime()/1000;
    }

    // console.log(d);
    // console.log(result);

    return result;
  }

  // formatDate(date: any, endDate: boolean = false) {
    
  //   console.log(endDate);
  //   console.log(date);

  //   let d = new Date(date.getTime() + date.getTimezoneOffset() * 60000); //offset to user timezone
  //   console.log(d);
    
  //   let result = 0;

  //   if (!endDate) {
  //     //d.setHours(0, 0, 0, 0);
  //     console.log(d);
  //     result = d.getTime() / 1000;

  //   } else {
  //     //d.setHours(23, 59, 59, 0);
  //     console.log(d);
  //     result = d.getTime()/1000;
  //   }

  //   console.log(result);

  //   return result;
  // }

  getPin() {
    let pin = null;
    let current_state = this.packing.current_state;

    switch (current_state) {
      case constants.ALERTS.ANALISYS:
        pin = { url: 'assets/images/pin_analise.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case constants.ALERTS.ABSENT:
        pin = { url: 'assets/images/pin_ausente.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case constants.ALERTS.INCORRECT_LOCAL:
        pin = { url: 'assets/images/pin_incorreto.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case constants.ALERTS.LOW_BATTERY:
        pin = { url: 'assets/images/pin_bateria.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case constants.ALERTS.LATE:
        pin = { url: 'assets/images/pin_atrasado.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case constants.ALERTS.PERMANENCE_TIME:
        pin = { url: 'assets/images/pin_permanencia.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case constants.ALERTS.NO_SIGNAL:
        pin = { url: 'assets/images/pin_sem_sinal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case constants.ALERTS.MISSING:
        pin = { url: 'assets/images/pin_perdido.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      default:
        pin = { url: 'assets/images/pin_normal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;
    }
    return pin;
  }

  getPinWithAlert(i: number) { 
    let pin = null; 
    let current_state = this.packing.current_state;

    switch (current_state) {
      case constants.ALERTS.ANALISYS:
        pin = { url: 'assets/images/pin_analise.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: 'assets/images/pin_analise_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: 'assets/images/pin_analise_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case constants.ALERTS.ABSENT:
        pin = { url: 'assets/images/pin_ausente.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: 'assets/images/pin_ausente_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: 'assets/images/pin_ausente_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case constants.ALERTS.INCORRECT_LOCAL:
        pin = { url: 'assets/images/pin_incorreto.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: 'assets/images/pin_incorreto_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: 'assets/images/pin_incorreto_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case constants.ALERTS.LOW_BATTERY:
        pin = { url: 'assets/images/pin_bateria.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: 'assets/images/pin_bateria_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: 'assets/images/pin_bateria_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case constants.ALERTS.LATE:
        pin = { url: 'assets/images/pin_atrasado.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: 'assets/images/pin_atrasado_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: 'assets/images/pin_atrasado_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case constants.ALERTS.PERMANENCE_TIME:
        pin = { url: 'assets/images/pin_permanencia.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: 'assets/images/pin_permanencia_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: 'assets/images/pin_permanencia_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case constants.ALERTS.NO_SIGNAL:
        pin = { url: 'assets/images/pin_sem_sinal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: 'assets/images/pin_sem_sinal_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: 'assets/images/pin_sem_sinal_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case constants.ALERTS.MISSING:
        pin = { url: 'assets/images/pin_perdido.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: 'assets/images/pin_perdido_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: 'assets/images/pin_perdido_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      default:
        pin = { url: 'assets/images/pin_normal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: 'assets/images/pin_normal_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: 'assets/images/pin_normal_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;
    }

    return pin;
  }

  getRadiusWithAlert() {
    let pin = "#027f01";
    let current_state = this.packing.current_state;

    switch (current_state) {

      case constants.ALERTS.ANALISYS:
        pin = "#b3b3b3";
        break;

      case constants.ALERTS.ABSENT:
        pin = "#ef5562";
        break;

      case constants.ALERTS.INCORRECT_LOCAL:
        pin = "#f77737";
        break;

      case constants.ALERTS.LOW_BATTERY:
        pin = "#f8bd37";
        break;

      case constants.ALERTS.LATE:
        pin = "#4dc9ff";
        break;

      case constants.ALERTS.PERMANENCE_TIME:
        pin = "#4c7bff";
        break;

      case constants.ALERTS.NO_SIGNAL:
        pin = "#9ecf99";
        break;

      case constants.ALERTS.MISSING:
        pin = "#3a9ca6";
        break;
    }

    return pin;
  }
}

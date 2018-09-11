import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Department } from '../../shared/models/department';
import { ModalRastComponent } from '../../shared/modal-rast/modal-rast.component';
import { AuthenticationService, PackingService, PlantsService, DepartmentService, SettingsService, InventoryService } from '../../servicos/index.service';
import { Pagination } from '../../shared/models/pagination';
import { MapsService } from '../../servicos/maps.service';
import './markercluster';

declare var $: any;
declare var google: any;
declare var MarkerClusterer: any;

//refatorar esse modulo esta muito grande e com coisas confusas
@Component({
  selector: 'app-rastreamento',
  templateUrl: './rastreamento.component.html',
  styleUrls: ['./rastreamento.component.css']
})

export class RastreamentoComponent implements OnInit {
  public data: Pagination = new Pagination({ meta: { page: 1 } });
  public logged_user: any;
  autocomplete: any;
  address: any = {};
  center: any = { lat: 0, lng: 0 };
  pos: any;
  plantSearch = null;
  departments: Department[];
  options = [];
  circles = [];
  zoom = 14;
  marker = {
    target: null,
    opt: null,
    display: true,
    lat: null,
    lng: null,
    plant: null,
    departments: new Pagination({ meta: { page: 1 } }),
    packings: new Pagination({ meta: { page: 1 } }),
    department: null,
    packing: null,
    nothing: null,
    profile: null
  };
  public packMarker = {
    display: true,
    lat: null,
    lng: null,
    start: null,
    packing_code: null,
    serial: null,
    battery: null,
    accuracy: null
  };

  numero: 1;
  plants = [];

  //selects
  public serials: any[];
  public codes: any[];
  
  //Bind dos selects
  public selectedCode;
  public selectedSerial;
  
  //array de pinos
  public plotedPackings: any[] = [];
  public listOfFactories: any = [];
  public listOfSuppliers: any = [];
  public listOfLogistic: any = [];

  //show markers
  public showControlledPlants: boolean = false;
  public showControlledLogistics: boolean = false;
  public showControlledSuppliers: boolean = false;
  public showPackings: boolean = false;

  //misc
  public settings: any;
  public permanence: Pagination = new Pagination({ meta: { page: 1 } }); 

  @ViewChild('myMap') myMap: any;

  constructor(
    private ref: ChangeDetectorRef,
    private departmentService: DepartmentService,
    private plantsService: PlantsService,
    private settingsService: SettingsService,
    private packingService: PackingService,
    private inventoryService: InventoryService,
    private mapsService: MapsService,
    private modalService: NgbModal,
    private auth: AuthenticationService

  ) {
    let user = this.auth.currentUser();
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine

  }

  locations = [
    { lat: -31.563910, lng: 147.154312 }
  ];


  ngOnInit() {
    
    this.getPlantRadius();
    this.loadPackingsOnSelect();
    this.loadDepartmentsByPlant();
    this.loadPackings();
  }


  onInitMap(map) { 
    
    const markers = this.plotedPackings.map((location, i) =>{
      return new google.maps.Marker({
        position: location.position, 
        icon: this.getPinWithAlert(location.status)
      }
    )});
    
    const marker = new MarkerClusterer(map, markers,
      { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
  }

  onChange(event) {
    this.center = { lat: event.lat, lng: event.lng };
    this.zoom = 14;
  }

  /**
   * Recupera o radius das plantas, configurado pelo usuário.
   */
  getPlantRadius() {
    this.settingsService.retrieve().subscribe(response => {
      let result = response.data[0];
      this.settings = result;
      this.settings.range_radius = this.settings.range_radius * 1000;
      //console.log('this.settings: ' + JSON.stringify(this.settings));
    })
  }

  /**
   * Carrega os fornecedores, fábricas e op logísticos no select Fornecedor
   */
  loadDepartmentsByPlant() {
    if (this.logged_user instanceof Array) {
      let user = this.auth.currentUser();
      this.plantsService.retrieveGeneralLogistic(this.logged_user, user._id)
        .subscribe(result => {

          this.plants = result.data;
          if (result.data.length > 0) {
            for (let data of result.data) {
              if (data.supplier) {
                this.listOfSuppliers.push({ id: data._id, name: data.plant_name, position: (new google.maps.LatLng(data.lat, data.lng)), profile: "supplier" });

              } else if (data.logistic_operator) {
                this.listOfLogistic.push({ id: data._id, name: data.plant_name, position: (new google.maps.LatLng(data.lat, data.lng)), profile: "logistic" });

              } else {
                this.listOfFactories.push({ id: data._id, name: data.plant_name, position: (new google.maps.LatLng(data.lat, data.lng)), profile: "normal" });
              }
            }

            
            this.center = { lat: result.data[0].lat, lng: result.data[0].lng };

            // console.log('this.currentUser: ' + JSON.stringify(this.auth.currentUser()));
            // console.log('this.options: ' + JSON.stringify(this.options));
            // console.log('this.listOfFactories: ' + JSON.stringify(this.listOfFactories));
            //console.log('this.listOfSuppliers: ' + JSON.stringify(this.listOfSuppliers));
            // console.log('this.listOfLogistic: ' + JSON.stringify(this.listOfLogistic));

          }
        }, err => { console.log(err) });
    } else {
      this.plantsService.retrieveGeneral(this.logged_user)
        .subscribe(result => {

          this.plants = result.data;
          if (result.data.length > 0) {
            for (let data of result.data) {
              if (data.supplier) {
                this.listOfSuppliers.push({ id: data._id, name: data.plant_name, position: (new google.maps.LatLng(data.lat, data.lng)), profile: "supplier" });

              } else if (data.logistic_operator) {
                this.listOfLogistic.push({ id: data._id, name: data.plant_name, position: (new google.maps.LatLng(data.lat, data.lng)), profile: "logistic" });

              } else {
                this.listOfFactories.push({ id: data._id, name: data.plant_name, position: (new google.maps.LatLng(data.lat, data.lng)), profile: "normal" });
              }
            }

            this.options.forEach(opt => this.circles.push({ position: { lat: opt.position[0], lng: opt.position[1] }, radius: this.auth.currentUser().radius }))

            // console.log('this.currentUser: ' + JSON.stringify(this.auth.currentUser()));
            // console.log('this.options: ' + JSON.stringify(this.options));
            // console.log('this.listOfFactories: ' + JSON.stringify(this.listOfFactories));
            // console.log('this.listOfSuppliers: ' + JSON.stringify(this.listOfSuppliers));
            // console.log('this.listOfLogistic: ' + JSON.stringify(this.listOfLogistic));

            this.center = { lat: result.data[0].lat, lng: result.data[0].lng };
          }
        }, err => { console.log(err) });
    }
  }

  /**
   * Carrega todos os pacotes do mapa 
   */
  loadPackings() {

    let params = {};
    if (this.selectedCode) params['family'] = this.selectedCode.packing;
    if (this.selectedSerial) params['serial'] = this.selectedSerial;
    
    this.mapsService.getPackings(params).subscribe(result => {
      this.plotedPackings = result.data;

      this.plotedPackings.map(elem => {
        elem.position = (new google.maps.LatLng(elem.latitude, elem.longitude));
        return elem;
      });

      console.log('plotedPackings: ' + JSON.stringify(this.plotedPackings));
    }, err => { console.log(err) });
  }

  /**
   * Exibir/Ocultar as fábricas
   */
  toggleShowPlants() {
    this.showControlledPlants = !this.showControlledPlants;
  }

  /**
   * Exibir/Ocultar os fornecedores
   */
  toggleShowSupplier() {
    this.showControlledSuppliers = !this.showControlledSuppliers;
  }

  /**
   * Exibir/Ocultar os operadores logísticos
   */
  toggleShowLogistic() {
    this.showControlledLogistics = !this.showControlledLogistics;
  }

  /**
   * Exibir/Ocultar as embalagens
   */
  toggleShowPackings() {
    this.showPackings = !this.showPackings;
  }

  /**
   * Carrega todos os equipamentos no select
   */
  loadPackingsOnSelect() {
    if (this.logged_user instanceof Array) {
      this.packingService.getPackingsDistinctsByLogistic(this.logged_user).subscribe(result => this.codes = result.data, err => { console.log(err) });

    } else if (this.logged_user) {
      this.packingService.getPackingsDistinctsBySupplier(this.logged_user).subscribe(result => this.codes = result.data, err => { console.log(err) });

    } else {
      this.packingService.getPackingsDistincts().subscribe(result => { this.codes = result.data }, err => { console.log(err) });
    } 
  }
  
  /**
   * An equipment was selected. This method fill the Serial Select.
   */
  loadSerialsOfSelectedEquipment(){

    if (this.selectedCode){
      this.loadPackings();

      this.selectedSerial = null;
      this.serials = [];

      this.packingService
        .getPackingsEquals(this.selectedCode.supplier._id, this.selectedCode.project._id, this.selectedCode.packing)
        .subscribe(result => {
          this.serials = result.data;
          // this.inventoryService
          //   .getInventoryPermanence(10, this.permanence.meta.page, this.selectedCode.packing)
          //   .subscribe(result => this.permanence = result, err => { console.log(err) });
        }, err => { console.log(err) })
    } 
  }

  /**
   * Equipment select was cleared.
   * Clear e disable the Serial Select.
   */
  onEquipmentSelectClear(){
    this.selectedSerial = null;
    
    this.loadPackings();

    //console.log('new this.selectedCode: ' + this.selectedCode);
    //console.log('new this.selectedSerial: ' + this.selectedSerial);
  }

  clicked(_a, opt) {
    var marker = _a.target;
    this.marker.target = _a
    this.marker.opt = opt
    this.marker.lat = marker.getPosition().lat();
    this.marker.lng = marker.getPosition().lng();
    this.marker.departments = new Pagination({ meta: { page: 1 } })
    this.marker.packings = new Pagination({ meta: { page: 1 } })

    this.departmentService.retrieveByPlants(10, this.marker.departments.meta.page, opt.id).subscribe(result => {
      this.marker.plant = opt.name;
      this.marker.profile = opt.profile;
      if (result.data.length > 0) {
        this.marker.department = true;
        this.marker.packing = false;
        this.marker.nothing = false;
        this.marker.departments = result;
        this.startWindow(marker);
      } else {
        this.packingService.retrieveByPlants(10, this.marker.packings.meta.page, opt.id).subscribe(result => {

          if (result.data.length > 0) {
            this.marker.department = false;
            this.marker.packing = true;
            this.marker.nothing = false;
            this.marker.packings = result;
            this.startWindow(marker);
          } else {
            this.marker.department = null
            this.marker.packing = null
            this.marker.nothing = true;
            this.startWindow(marker);
          }
        })
      }
    })
  }

  clickedPack(_a, opt) {
    console.log('clickedPack');

    let mkr = _a.target;

    this.packMarker.lat = mkr.getPosition().lat();
    this.packMarker.lng = mkr.getPosition().lng();
    this.packMarker.start = opt.start;
    this.packMarker.battery = opt.battery;
    this.packMarker.packing_code = opt.packing_code;
    this.packMarker.serial = opt.serial;
    this.packMarker.accuracy = opt.accuracy;

    //console.log('packMarker: ' + JSON.stringify(this.packMarker));
    
    this.startPackWindow(mkr);
  }

  retrievePackings(_a, opt) {
    var marker = _a.target;
    this.marker.target = _a
    this.marker.opt = opt
    this.marker.lat = marker.getPosition().lat();
    this.marker.lng = marker.getPosition().lng();
    this.packingService.retrieveByPlants(10, this.marker.packings.meta.page, opt.id).subscribe(result => {

      if (result.data.length > 0) {
        this.marker.department = false;
        this.marker.packing = true;
        this.marker.nothing = false;
        this.marker.packings = result;
        this.startWindow(marker);
      } else {
        this.marker.department = null
        this.marker.packing = null
        this.marker.nothing = true;
        this.startWindow(marker);
      }
    })
  }

  retrieveDepartments(_a, opt) {
    var marker = _a.target;
    this.marker.target = _a
    this.marker.opt = opt
    this.marker.lat = marker.getPosition().lat();
    this.marker.lng = marker.getPosition().lng();

    this.departmentService.retrieveByPlants(10, this.marker.departments.meta.page, opt.id).subscribe(result => {
      this.marker.plant = opt.name;
      this.marker.profile = opt.profile;
      if (result.data.length > 0) {
        this.marker.department = true;
        this.marker.packing = false;
        this.marker.nothing = false;
        this.marker.departments = result;
        this.startPackWindow(marker);
      }
    })
  }

  pageChangedDepart(page: any): void {
    this.marker.departments.meta.page = page;
    this.retrieveDepartments(this.marker.target, this.marker.opt);
  }

  pageChangedPacking(page: any): void {
    this.marker.packings.meta.page = page;
    this.retrievePackings(this.marker.target, this.marker.opt);
  }

  open(id) {
    const modalRef = this.modalService.open(ModalRastComponent);
    modalRef.componentInstance.department = id;
  }

  startWindow(marker) {
    marker.nguiMapComponent.openInfoWindow('iw', marker);
    var iwOuter = $('.gm-style-iw');
    iwOuter.children().css("display", "block");

    iwOuter.children(':nth-child(1)').css({ 'width': '100%' });
    var iwCloseBtn = iwOuter.next();
    iwCloseBtn.css({
      'right': '11px',
      'top': '17px',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-image': 'url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTUwNS45NDMsNi4wNThjLTguMDc3LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDksMEw2LjA1OCw0NzYuNjkzYy04LjA3Nyw4LjA3Ny04LjA3NywyMS4xNzIsMCwyOS4yNDkgICAgQzEwLjA5Niw1MDkuOTgyLDE1LjM5LDUxMiwyMC42ODMsNTEyYzUuMjkzLDAsMTAuNTg2LTIuMDE5LDE0LjYyNS02LjA1OUw1MDUuOTQzLDM1LjMwNiAgICBDNTE0LjAxOSwyNy4yMyw1MTQuMDE5LDE0LjEzNSw1MDUuOTQzLDYuMDU4eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTUwNS45NDIsNDc2LjY5NEwzNS4zMDYsNi4wNTljLTguMDc2LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDgsMGMtOC4wNzcsOC4wNzYtOC4wNzcsMjEuMTcxLDAsMjkuMjQ4bDQ3MC42MzYsNDcwLjYzNiAgICBjNC4wMzgsNC4wMzksOS4zMzIsNi4wNTgsMTQuNjI1LDYuMDU4YzUuMjkzLDAsMTAuNTg3LTIuMDE5LDE0LjYyNC02LjA1N0M1MTQuMDE4LDQ5Ny44NjYsNTE0LjAxOCw0ODQuNzcxLDUwNS45NDIsNDc2LjY5NHoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)'
    });
    iwCloseBtn.children(':nth-child(1)').css({ 'display': 'none' });
  }

  startPackWindow(marker) {
    marker.nguiMapComponent.openInfoWindow('pw', marker);
    var iwOuter = $('.gm-style-iw');
    iwOuter.children().css("display", "block");

    iwOuter.children(':nth-child(1)').css({ 'width': '100%' });
    var iwCloseBtn = iwOuter.next();
    iwCloseBtn.css({
      'right': '11px',
      'top': '17px',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-image': 'url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTUwNS45NDMsNi4wNThjLTguMDc3LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDksMEw2LjA1OCw0NzYuNjkzYy04LjA3Nyw4LjA3Ny04LjA3NywyMS4xNzIsMCwyOS4yNDkgICAgQzEwLjA5Niw1MDkuOTgyLDE1LjM5LDUxMiwyMC42ODMsNTEyYzUuMjkzLDAsMTAuNTg2LTIuMDE5LDE0LjYyNS02LjA1OUw1MDUuOTQzLDM1LjMwNiAgICBDNTE0LjAxOSwyNy4yMyw1MTQuMDE5LDE0LjEzNSw1MDUuOTQzLDYuMDU4eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTUwNS45NDIsNDc2LjY5NEwzNS4zMDYsNi4wNTljLTguMDc2LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDgsMGMtOC4wNzcsOC4wNzYtOC4wNzcsMjEuMTcxLDAsMjkuMjQ4bDQ3MC42MzYsNDcwLjYzNiAgICBjNC4wMzgsNC4wMzksOS4zMzIsNi4wNTgsMTQuNjI1LDYuMDU4YzUuMjkzLDAsMTAuNTg3LTIuMDE5LDE0LjYyNC02LjA1N0M1MTQuMDE4LDQ5Ny44NjYsNTE0LjAxOCw0ODQuNzcxLDUwNS45NDIsNDc2LjY5NHoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)'
    });
    iwCloseBtn.children(':nth-child(1)').css({ 'display': 'none' });
  }

  funcaoTop() {
    // google.maps.event.addListener('iw', 'domready', function () {
    //   var iwOuter = $('.gm-style-iw');
    //   var iwBackground = iwOuter.prev();
    //   iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
    //   iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
    // });
  }

  close() {
    close();
  }

  /**
   * Recupera o pino da embalagem de acordo com seu alerta
   */
  getPinWithAlert(status: any) {
    let pin = null;

    //console.log(status); 

    switch (status) {
      case 'MISSING':
        pin = { url: '../../../assets/images/pin_ausente.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 'INCORRECT_LOCAL':
        pin = { url: '../../../assets/images/pin_incorreto.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 'LATE':
        pin = { url: '../../../assets/images/pin_atrasado.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 'PERMANENCE_EXCEEDED':
        pin = { url: '../../../assets/images/pin_permanencia.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      default:
        pin = { url: '../../../assets/images/pin_normal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;
    }

    return pin;
  }

}

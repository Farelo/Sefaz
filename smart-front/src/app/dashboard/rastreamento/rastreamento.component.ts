import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Department } from '../../shared/models/department';
import { ModalRastComponent } from '../../shared/modal-rast/modal-rast.component';
import { AuthenticationService, PackingService, PlantsService, DepartmentService, SettingsService, InventoryService } from '../../servicos/index.service';
import { Pagination } from '../../shared/models/pagination';
import { MapsService } from '../../servicos/maps.service';
import './markercluster';
import { Spiralize } from './Spiralize';

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
    position: null,
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

  ngOnInit() {

    this.getPlantRadius();
    this.loadPackingsOnSelect();
    this.loadDepartmentsByPlant();
  }

  public mMap: any;
  onInitMap(map) {
 
    this.zoom = 14;
    this.mMap = map;
    this.loadPackings();
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
            this.center = { lat: result.data[0].lat, lng: result.data[0].lng };
          }
        }, err => { console.log(err) });
    }
  }

  /**
   * Carrega todos os pacotes do mapa 
   */
  public spiralPath: google.maps.Polyline = new google.maps.Polyline();
  public spiralPoints: any = [];
  public infoWin: google.maps.InfoWindow = new google.maps.InfoWindow();
  public mSpiralize: Spiralize;

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

      //this.resolveClustering();
      if (this.mSpiralize){ 
        this.mSpiralize.clearState();
        this.mSpiralize.repaint(this.plotedPackings, this.mMap, false, true);

      } else{
        this.mSpiralize = new Spiralize(this.plotedPackings, this.mMap, false);
      }

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
    this.mSpiralize.toggleShowPackings(this.showPackings);
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
  loadSerialsOfSelectedEquipment() {

    if (this.selectedCode) {

      this.loadPackings();
      this.selectedSerial = null;
      this.serials = [];
      this.packingService
        .getPackingsEquals(this.selectedCode.supplier._id, this.selectedCode.project._id, this.selectedCode.packing)
        .subscribe(result => {
          this.serials = result.data;
        }, err => { console.log(err) })
    }
  }

  /**
   * Equipment select was cleared.
   * Clear e disable the Serial Select.
   */
  onEquipmentSelectClear() {
    
    this.selectedSerial = null;
    this.loadPackings();
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
        });
      }
    });
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
  }

  startPackWindow(marker) {
    marker.nguiMapComponent.openInfoWindow('pw', marker);
  }

  /**
   * Recupera o pino da embalagem de acordo com seu alerta
   */
  getPinWithAlert(status: any, smallSize:boolean = false) {
    let pin = null;

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

    if (smallSize){
      pin.size = (new google.maps.Size(21, 31));
      pin.scaledSize = (new google.maps.Size(21, 31));
    }

    return pin;
  }

  /**
   * Misc ...
   * Relative to side-menu
   */
  private _opened: boolean = false;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Department } from '../../shared/models/department';
import { ModalRastComponent } from '../../shared/modal-rast/modal-rast.component';
import { AuthenticationService, PackingService, DepartmentService, FamiliesService, DevicesService, ControlPointsService, ControlPointTypesService } from '../../servicos/index.service';
import { DatepickerModule, BsDatepickerModule, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
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
  center: any = { lat: -15.793537, lng: -47.882803 }; //O mapa inicia centralizado no Brasil
  pos: any;

  departments: Department[];
  options = [];
  circles = [];
  zoom = 14;
  marker = {
    id: null,
    name: null,
    target: null,
    opt: null,
    display: true,
    lat: null,
    lng: null,
    packing: null
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

  /*
   * DataPicker
   */
  datePickerConfig = new BsDaterangepickerConfig(); //Configurations
  public todayDate: Date = null;   // Today date
  public rangeDate: any = null;
  public lastHours: any = null;
  public lastHoursOptions: any[] = [];
  public statusOptions: any[] = [];

  //Control point filters
  public selectedLinkedCompany: any = null;
  public listOfLinkedCompanies: any = [];

  public selectedControlPointType: any = null;
  public listOfControlPointType: any = null;

  public selectedControlPoint: any = null;
  public listOfControlPoints: any = [];
  
  //Packing filters
  public selectedFamily: any = null;
  public listOfFamilies: any = [];
  public auxListOfFamilies: any = [];

  public selectedSerial: any = null;
  public listOfSerials: any[];

  //array de pinos
  public plotedPackings: any[] = [];

  //show markers
  public showControlledPlants: boolean = false;
  public showControlledLogistics: boolean = false;
  public showControlledSuppliers: boolean = false;
  public showPackings: boolean = false;

  //misc
  public settings: any = {};
  public permanence: Pagination = new Pagination({ meta: { page: 1 } });

  constructor(
    private controlPointsService: ControlPointsService,
    private familyService: FamiliesService,
    private authenticationService: AuthenticationService,
    private deviceService: DevicesService,
    private packingService: PackingService,
    private controlPointTypesService: ControlPointTypesService,
    private mapsService: MapsService,
    private modalService: NgbModal,
    private auth: AuthenticationService,
    private localeService: BsLocaleService) {

    defineLocale('pt-br', ptBrLocale);
    this.localeService.use('pt-br');

    //Initialize 7 days before now
    let sub = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
    // this.initialDate = new Date(sub);
    // this.finalDate = new Date();

    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.displayMonths = 1;
    this.datePickerConfig.containerClass = 'theme-dark-blue';
  }

  ngOnInit() {

    this.getPlantRadius();
    this.fillHours();
    this.loadLinkedCompanies();
    this.loadControlPointTypes();
    this.loadControlPoints();
    this.fillStates();
  }

  public mMap: any;
  onInitMap(map) {

    this.zoom = 14;
    this.mMap = map;
  }


  onChange(event) {
    this.center = { lat: event.lat, lng: event.lng };
    this.zoom = 14;
  }

  fillHours() {
    this.lastHoursOptions = [
      { label: '1h', value: '1' },
      { label: '2h', value: '2' },
      { label: '3h', value: '3' },
      { label: '4h', value: '4' },
      { label: '5h', value: '5' },
      { label: '6h', value: '6' },
      { label: '7h', value: '7' },
      { label: '8h', value: '8' },
      { label: '9h', value: '9' },
      { label: '10h', value: '10' },
      { label: '11h', value: '11' },
      { label: '12h', value: '12' },
    ]
  }

  fillStates() {
    this.statusOptions = [
      { label: 'Viagem Perdida', value: 'viagem_perdida' },
      { label: 'Local Incorreto', value: 'local_incorreto' },
      { label: 'Bateria Baixa', value: 'bateria_baixa' },
      { label: 'Viagem Atrasada', value: 'viagem_atrasada' },
      { label: 'Sem Sinal', value: 'sem_sinal' },
      { label: 'Perdida', value: 'perdida' },
      { label: 'Análise', value: 'analise' },
      { label: 'Viagem em prazo', value: 'viagem_em_prazo' },
      { label: 'Local Correto', value: 'local_correto' },
      { label: 'Tempo de Permanência Excedido', value: 'tempo_de_permanencia_excedido' },
      { label: 'Desabilitada com sinal', value: 'desabilitada_com_sinal' },
      { label: 'Desabilitada sem sinal', value: 'desabilitada_sem_sinal' },
    ]
  }

  dateChange(type) {
    /**
     * todayDate
     * rangeDate
     * lastHours
     */

    if (type == 'todayDate') {
      this.rangeDate = null;
      this.lastHours = null;
    }

    if (type == 'rangeDate') {
      this.todayDate = null;
      this.lastHours = null;
    }

    if (type == 'lastHours') {
      this.todayDate = null;
      this.rangeDate = null;
    }

    console.log(this.todayDate)
    console.log(this.rangeDate)
    console.log(this.lastHours)
  }















  /**
   * Recupera o radius das plantas, configurado pelo usuário.
   */
  getPlantRadius() {

    let currentSetting = this.authenticationService.currentSettings();
    this.settings['range_radius'] = currentSetting.range_radius;
  }

  /**
   * Carrega as empresas no select de empresa
   */
  loadLinkedCompanies() {

    this.familyService.getAllFamilies().subscribe(result => {

      this.listOfFamilies = result;
      this.auxListOfFamilies = result;

      // console.log('..');
      // console.log(result);
      let auxListOfLinkedCompanies = [];

      this.listOfLinkedCompanies = result.map(elem => {
        if (auxListOfLinkedCompanies.length < 1) {
          auxListOfLinkedCompanies.push(elem.company);
        } else {
          if (auxListOfLinkedCompanies.map(e => e._id).indexOf(elem.company._id) === -1)
            auxListOfLinkedCompanies.push(elem.company);
        }
      });

      // console.log(auxListOfLinkedCompanies);

      this.listOfLinkedCompanies = auxListOfLinkedCompanies;

    }, err => console.error(err));
  }

  loadControlPointTypes() {

    this.controlPointTypesService
      .getAllTypes()
      .subscribe(data => {

        this.listOfControlPointType = data;
      },
        err => { console.log(err) });
  }

  public listOfCircleControlPoints: any = [];
  public listOfPolygonControlPoints: any = [];

  loadControlPoints() {

    this.controlPointsService.getAllControlPoint().subscribe(result => {
      
      this.listOfControlPoints = result

      this.listOfCircleControlPoints = result
        .filter(elem => elem.geofence.type == 'c')
        .map(elem => {
          elem.position = (new google.maps.LatLng(elem.geofence.coordinates[0].lat, elem.geofence.coordinates[0].lng));
          return elem;
        });

      this.listOfPolygonControlPoints = result
        .filter(elem => elem.geofence.type == 'p')
        .map(elem => {

          let lat = elem.geofence.coordinates.map(p => p.lat);
          let lng = elem.geofence.coordinates.map(p => p.lng);

          elem.position = {
            lat: (Math.min.apply(null, lat) + Math.max.apply(null, lat)) / 2,
            lng: (Math.min.apply(null, lng) + Math.max.apply(null, lng)) / 2
          }

          return elem;
        });

      // console.log(this.listOfCircleControlPoints);
      // console.log(this.listOfPolygonControlPoints);

    }, err => console.error(err));
  }

  /**
   * Carrega todos os pacotes do mapa
   */
  public spiralPath: google.maps.Polyline = new google.maps.Polyline();
  public spiralPoints: any = [];
  public infoWin: google.maps.InfoWindow = new google.maps.InfoWindow();
  public mSpiralize: Spiralize;


  /**
   * An equipment was selected. This method fill the Serial Select.
   */
  loadSerialsOfSelectedEquipment() {

    // console.log('loadSerialsOfSelectedEquipment');
    // console.log(this.selectedFamily);

    if (this.selectedFamily) {
      //this.loadPackings();
      this.selectedSerial = null;
      this.listOfSerials = [];

      let query = { family: this.selectedFamily._id };

      this.packingService.getAllPackings(query).subscribe(result => {
        this.listOfSerials = result.filter(elem => {
          return elem.family.code == this.selectedFamily.code;
        });
      }, err => { console.log(err) })
    }
  }

  companyChanged(event: any) {
    // console.log(event);

    if (event) {
      this.listOfFamilies = this.auxListOfFamilies.filter(elem => {
        return elem.company._id == event._id;
      });
    } else {
      this.listOfFamilies = this.auxListOfFamilies;
    }
  }


  /**
   * The filter has changed
   * Renamed from loadPackings()
   */
  requestFilteredResults() {

    // console.log('.');
    let param = {
      date: null,
      start_date: null,
      end_date: null,
      last_hours: null,
      company_type: null,
      company_id: null,
      control_point_type: null,
      control_point_id: null,
      family_id: null,
      serial: null
    };

    console.log(this.todayDate)
    console.log(this.rangeDate)
    console.log(this.lastHours)
    console.log(this.selectedLinkedCompany)
    console.log(this.selectedControlPointType)
    console.log(this.selectedControlPoint)
    console.log(this.selectedFamily)
    console.log(this.selectedSerial)


    // **********************
    // Date section
    if (this.todayDate !== null)
      param.date = this.todayDate

    if (this.rangeDate !== null) {
      param.start_date = this.rangeDate[0]
      param.end_date = this.rangeDate[1]
    }

    if (this.lastHours !== null)
      param.last_hours = this.lastHours

    // **********************
    // company section
    param.company_id = this.selectedLinkedCompany        // Linked company
    param.control_point_type = this.selectedControlPointType        // Control point type
    param.control_point_id = this.selectedControlPoint; // Control point

    // **********************
    // packing section
    param.family_id = this.selectedFamily._id;     // Family
    param.serial = this.selectedSerial;     // Serial

    console.log(param);

    this.deviceService.getHistoricalDeviceData(param).subscribe((result: any[]) => {

      this.plotedPackings = result.filter(elem => {
        if (elem.last_device_data)
          return true;
        else
          return false;
      });

      this.plotedPackings.map(elem => {
        elem.position = (new google.maps.LatLng(elem.last_device_data.latitude, elem.last_device_data.longitude));
        elem.latitude = elem.last_device_data.latitude;
        elem.longitude = elem.last_device_data.longitude;
        return elem;
      });

      //Se só há um objeto selecionado, centralize o mapa nele
      if (this.plotedPackings.length == 1) {
        if (this.plotedPackings[0].last_device_data) {
          this.center = { lat: this.plotedPackings[0].latitude, lng: this.plotedPackings[0].longitude }
        }
      }
      console.log(JSON.stringify(this.plotedPackings));

      //this.resolveClustering();
      if (this.mSpiralize) {
        this.mSpiralize.clearState();
        this.mSpiralize.repaint(this.plotedPackings, this.mMap, false, true);

      } else {
        this.mSpiralize = new Spiralize(this.plotedPackings, this.mMap, false);
      }
    });
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


  filterChanged() {

  }

  /**
   * Equipment select was cleared.
   * Clear e disable the Serial Select.
   */
  onEquipmentSelectClear() {

    this.selectedSerial = null;
    //this.loadPackings();
  }

  public packingsByPlant: any[] = [];
  public packingsByPlantActualPage: number = -1;

  clicked(_a, opt) {

    var marker = _a.target;
    //this.marker.target = _a
    this.marker.id = opt._id;
    this.marker.name = opt.name;
    this.marker.lat = marker.getPosition().lat();
    this.marker.lng = marker.getPosition().lng();

    this.packingService.packingsOnControlPoint(opt._id).subscribe(result => {
      // console.log('');
      // console.log(result);
      this.packingsByPlant = result;
      this.startWindow(marker);
    });
  }


  open(id) {
    const modalRef = this.modalService.open(ModalRastComponent);
    modalRef.componentInstance.department = id;
  }

  startWindow(marker) {
    marker.nguiMapComponent.openInfoWindow('iw', marker);
  }


  /**
   * Recupera o pino da embalagem de acordo com seu alerta
   */
  getPinWithAlert(status: any, smallSize: boolean = false) {
    let pin = null;

    switch (status) {
      case 'MISSING':
        pin = { url: 'assets/images/pin_ausente.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 'INCORRECT_LOCAL':
        pin = { url: 'assets/images/pin_incorreto.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 'LATE':
        pin = { url: 'assets/images/pin_atrasado.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 'PERMANENCE_EXCEEDED':
        pin = { url: 'assets/images/pin_permanencia.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      default:
        pin = { url: 'assets/images/pin_normal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;
    }

    if (smallSize) {
      pin.size = (new google.maps.Size(21, 31));
      pin.scaledSize = (new google.maps.Size(21, 31));
    }

    return pin;
  }

  /**
   * Misc ...
   * Relative to side-menu
   */
  private _opened: boolean = true;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }
}

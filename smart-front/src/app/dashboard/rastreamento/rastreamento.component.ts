import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from '../../servicos/departments.service';
import { PlantsService } from '../../servicos/plants.service';
import { Department } from '../../shared/models/department';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PackingService } from '../../servicos/packings.service';
import { ModalRastComponent } from '../../shared/modal-rast/modal-rast.component';
import { AuthenticationService } from '../../servicos/auth.service';
import { Pagination } from '../../shared/models/pagination';
declare var $: any;
declare var google: any;

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
  center: any;
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
  numero: 1;
  plants = [];

  constructor(
    private ref: ChangeDetectorRef,
    private departmentService: DepartmentService,
    private plantsService: PlantsService,
    private packingService: PackingService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private auth: AuthenticationService

  ) { 
    let user = this.auth.currentUser();
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine

  }

  loadDepartmentsByPlant() {
    if (this.logged_user instanceof Array) {
      let user = this.auth.currentUser();
      this.plantsService.retrieveGeneralLogistic(this.logged_user,user._id )
        .subscribe(result => {
         
          this.plants = result.data;
          if (result.data.length > 0) {
            for (let data of result.data) {
              if (data.supplier) {
                this.options.push({ id: data._id, name: data.plant_name, position: [data.lat, data.lng], profile: "supplier" });
              } else {
                this.options.push({ id: data._id, name: data.plant_name, position: [data.lat, data.lng], profile: "logistic" });
              } 
            }
            this.center = { lat: result.data[0].lat, lng: result.data[0].lng };
          }
        }, err => { console.log(err) });
    }else{
      this.plantsService.retrieveGeneral(this.logged_user)
        .subscribe(result => {
         
          this.plants = result.data;
          if (result.data.length > 0) {
            for (let data of result.data) {
              if (data.supplier) {
                this.options.push({ id: data._id, name: data.plant_name, position: [data.lat, data.lng], profile: "supplier" });
              } else if(data.logistic_operator) {
                this.options.push({ id: data._id, name: data.plant_name, position: [data.lat, data.lng], profile: "logistic" });
              }else{
                this.options.push({ id: data._id, name: data.plant_name, position: [data.lat, data.lng], profile: "normal" });
              }
            }  
           
            this.options.forEach(opt => this.circles.push({ position: { lat: opt.position[0], lng: opt.position[1] }, radius: this.auth.currentUser().radius}))
            this.center = { lat: result.data[0].lat, lng: result.data[0].lng };
           

          }
        }, err => { console.log(err) });
    }
  }

  onChange(event) {
    this.center = { lat: event.lat, lng: event.lng };
    this.zoom = 14;
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
          console.log(result.data)
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

  retrievePackings(_a, opt){
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

  retrieveDepartments(_a, opt){
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
        this.startWindow(marker);
      }
    })
  }

  ngOnInit() {
    this.loadDepartmentsByPlant();
    this.carregarTamanho();
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

  carregarTamanho() {
    var map = $('#map');
    var nguimap = map.children(':nth-child(1)');
    var googleMap = nguimap.children(':nth-child(1)').css({ 'position': 'absolute' });
    googleMap.css({ 'height': 'calc(100% - 42px)' });
  }

  startWindow(marker) {
    marker.nguiMapComponent.openInfoWindow('iw', marker);
    var iwOuter = $('.gm-style-iw');
    var iwBackground = iwOuter.prev();
    iwBackground.css({ 'border': '1px solid #000' });
    iwBackground.css({ 'background-color': 'red' });
    iwBackground.children(':nth-child(3)').css({ 'z-index': '1' });
    iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
    
    
    var iwCloseBtn = iwOuter.next();
    
    var altura = $('.iw-title').height();
    
    iwCloseBtn.css({
      opacity: '0.5', // by default the close button has an opacity of 0.7
      // right: '0px',
      top: '40px',
      left: 'calc(altura - 20px)'
    });

    iwCloseBtn.css({ 'background-color': 'red' });
    iwCloseBtn.css({ 'background': 'url(data:image/png;base64,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) no-repeat left center' });
    iwCloseBtn.css({ 'background-size': '13px' });

    // iwCloseBtn.css({'background' : 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAXCAYAAAD3CERpAAAACXBIWXMAAAsSAAALEgHS3X78AAABGklEQVRIx+2W4U3DMBCFv1gZIBtQNsgG0AkoI7BBRjAbZBPKBt4AukG6gTvB488VRZYb4hSChHhSfsTn+PNdni+pJAF0wI6f1WCciKRe6+ldEpUs1RX1WCcDB8AD8RshHfAwum/JlGCQtJPElVcrKWTW9y6zsxvgBdgDmwWZNVatN+AuOyPZxT65j5K6guzurVKpecZjPoVOPdhOwJoLG/YWD19Bz4v4zPvoLTYGdgYYK0jajObMgk6Z4Wy0XCxeMGERdCqbOVXIQt1MR/bm5NdM7ABsP1vcDLmCoxCtP2+BI3ACnoEWCCVnql5wDoOBGmvixaoXtrZ4Tat0/IL+oX8Pmrp3jb+IWEka7Bu6lm6ddZnjCrAT8AQMH3jl/HRbCP5BAAAAAElFTkSuQmCC) no-repeat left center'});
    iwOuter.next().next().css({ 'top': '15px'})
    iwCloseBtn.children(':nth-child(1)').css({ 'display': 'none' });
    iwCloseBtn.mouseout(function () {
      $(this).css({ opacity: '0.5' });
    });

  }

  funcaoTop() {
    google.maps.event.addListener('iw', 'domready', function () {
      var iwOuter = $('.gm-style-iw');
      var iwBackground = iwOuter.prev();
      iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
      iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
    });
  }
  close() {
    close();
  }

  onMapReady(map) {
  
    console.log('map', map);
  }
}

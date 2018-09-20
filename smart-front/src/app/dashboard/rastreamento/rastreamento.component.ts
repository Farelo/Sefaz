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

  @ViewChild('myMap') myMap: any;
  @ViewChild('myInfo') myInfo; 

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

  /** 
    <canvas id="myCanvas" width="400" height="400" style="border:1px solid #c3c3c3;"></canvas>
    <script type="text/javascript">
        var c=document.getElementById("myCanvas");
        var cxt=c.getContext("2d");
        var centerX = 200;
        var centerY = 200;
        cxt.moveTo(centerX, centerY);

        var STEPS_PER_ROTATION = 60;
        var increment = 2*Math.PI/STEPS_PER_ROTATION;
        var theta = increment;

        while( theta < 200*Math.PI) {
          var newX = (centerX + (theta) * Math.cos(theta/30));
          var newY = (centerY + (theta) * Math.sin(theta/30));
          cxt.lineTo(newX, newY);
          theta = theta + increment;
        }
        cxt.stroke(); 
   */

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
  public spiralPath: google.maps.Polyline = new google.maps.Polyline();
  public spiralPoints: any = [];
  public infoWin: google.maps.InfoWindow = new google.maps.InfoWindow();

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

      //console.log('plotedPackings: ' + JSON.stringify(this.plotedPackings));
      this.resolveClustering();

    }, err => { console.log(err) });
  }
  
  /**
   * Tratando os ícones empilhados
   */
  resolveClustering(){

    this.normalizeDuplicatedPackages();

    this.configureListeners();
    
    this.configureSpiral();
  }

  public duplicated: any = [];
  normalizeDuplicatedPackages(){
    //this.plotedPackings = [1, 2, 3, 1, 4, 5, 6, 1, 1, 7, 1, 2, 3, 2]; 
    let auxDuplicated = [];

    let i = 0;
    let j = 0;
    let l = this.plotedPackings.length;
    console.log(`plotedPackings: ${JSON.stringify(this.plotedPackings)}`);

    while (i < l) {
      j = i + 1;
      auxDuplicated = [];

      while (j < l) {
        // console.log(`i: ${i}, j: ${j}, l: ${l}`);

        if ((this.plotedPackings[i].latitude == this.plotedPackings[j].latitude) &&
          (this.plotedPackings[i].longitude == this.plotedPackings[j].longitude)) {
          // console.log(`[i] ${this.plotedPackings[i]},  [j] ${this.plotedPackings[j]}`)
          // console.log('this.duplicated.length: ' + auxDuplicated.length);

          if (auxDuplicated.length == 0) {
            // console.log('.');
            auxDuplicated.push(this.plotedPackings[i], this.plotedPackings[j]);
            this.plotedPackings.splice(j, 1);
            l = this.plotedPackings.length;
            j--;

          } else {
            // console.log('..');
            auxDuplicated.push(this.plotedPackings[j]);
            this.plotedPackings.splice(j, 1);
            l = this.plotedPackings.length;
            j--;
          }
        }
        j++;
      }

      if (auxDuplicated.length > 0) this.duplicated.push(auxDuplicated);

      i++;
    }

    //console.log('2. plotedPackings: ' + JSON.stringify(this.plotedPackings));
    console.log('3. duplicated: ' + JSON.stringify(this.duplicated));
    //console.log('4. auxDuplicated: ' + JSON.stringify(auxDuplicated));
  }

  /**
   * Plot all points, clusterize and set the listeners of click and zoom change
   */
  public markers:any[] = [];
  configureListeners() {

    //console.log('listener this.plotedPackings: ' + this.plotedPackings);
    this.markers = this.plotedPackings.map((location, i) => {
      let m = new google.maps.Marker({
        packing_code: location.packing_code,
        serial: location.serial,
        battery: location.battery,
        accuracy: location.accuracy,
        position: location.position,
        icon: this.getPinWithAlert(location.status)
      })

      google.maps.event.addListener(m, 'click', (evt) => {
        console.log('click location:' + JSON.stringify(location));

        this.infoWin.setContent(
          `<div id="m-iw" style="">
            <div style="color: #3e4f5f; padding: 10px 6px; font-weight: 700; font-size: 16px;">
              INFORMAÇÕES</div>
            <div style="padding: 0px 6px;">
              <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Embalagem:</span> ${m.packing_code}</p>
              <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Serial:</span> ${m.serial}</p>
              <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Bateria:</span> ${m.battery.toFixed(2)}%</p>
              <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Acurácia:</span> ${m.accuracy || '-'}m</p>
            </div>
          </div>`);

        this.infoWin.open(this.mMap, m);
      });

      google.maps.event.addListener(this.mMap, 'zoom_changed', () => {
        console.log('zoom changed:' + JSON.stringify(this.mMap.getZoom()));

        this.clearSpiral();
      });

      return m;
    });

    // const marker = new MarkerClusterer(this.mMap, this.markers, { 
    //   maxZoom: 14,
    //   imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    // });
  }

  
  /**
   * Resolve the spiral of repeated points
   */
  public iconsOfduplicated:any[] = [];
  configureSpiral(){

    /**
     * 1. Do array plotar apenas o primeiro elemento.
     * 2. No clique, calcular a posição dos demais ícones.
     */
    this.iconsOfduplicated = [];
    this.duplicated.map(array => {

      /**
       * Plota UM pino das embalagens duplicadas
       */
      let m = new google.maps.Marker({
        packing_code: array[0].packing_code,
        serial: array[0].serial,
        position: { lat: array[0].latitude, lng: array[0].longitude },
        icon: { url: '../../../assets/images/pin_cluster.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
      })

      this.iconsOfduplicated.push(m);
      //m.setMap(this.mMap);
      
      /**
       * Trata o clique do pino duplicado
       */
      google.maps.event.addListener(m, 'click', (evt) => {
        
        console.log('entrou no event listener');
        
        if (this.spiralPath.getMap()) { //Se está exibindo o espiral, remove-o
          
          this.clearSpiral();
          
        } else {  //Se não está exibindo o espiral, exibe-o

          console.log('..flightPath');
          let spiralCoordinates: any = [];

          var centerX = array[0].latitude;
          var centerY = array[0].longitude;

          spiralCoordinates.push({ lat: centerX, lng: centerY });
          
          //distância entre as voltas da espiral
          var radius = 6.5;
 
          // distância enter dois pontos plotados
          var chord = 1;

          //normalizando as constantes de cada zoom
          if (this.mMap.getZoom() == 4) { radius = 10.24; chord = 2.4; }; 
          if (this.mMap.getZoom() == 5) { radius = 5.12; chord = 1.2; }; 
          if (this.mMap.getZoom() == 6) { radius = 2.56; chord = 0.6; };
          if (this.mMap.getZoom() == 7) { radius = 1.28; chord = 0.3; }; 
          if (this.mMap.getZoom() == 8) { radius = 0.64; chord = 0.2; };
          if (this.mMap.getZoom() == 9) { radius = 0.32; chord = 0.1; };
          if (this.mMap.getZoom() == 10) { radius = 0.16; chord = 0.05; };
          if (this.mMap.getZoom() == 11) { radius = 0.08; chord = 0.025; };
          if (this.mMap.getZoom() == 12) { radius = 0.04; chord = 0.0125; };
          if (this.mMap.getZoom() == 13) { radius = 0.02; chord = 0.00625; };
          if (this.mMap.getZoom() == 14) { radius = 0.01; chord = 0.003125; };
          if (this.mMap.getZoom() == 15) { radius = 0.005; chord = 0.0015625; };
          if (this.mMap.getZoom() == 16) { radius = 0.0025; chord = 0.00078125; };
          if (this.mMap.getZoom() == 17) { radius = 0.00125; chord = 0.000390625; };
          if (this.mMap.getZoom() == 18) { radius = 0.000625; chord = 0.0001953125; };
          if (this.mMap.getZoom() == 19) { radius = 0.0003125; chord = 0.00009765625; };
          if (this.mMap.getZoom() == 20) { radius = 0.00015625; chord = 0.000048828125; };
          if (this.mMap.getZoom() == 21) { radius = 0.000078125; chord = 0.0000244140625; };
          if (this.mMap.getZoom() == 22) { radius = 0.0000390625; chord = 0.00001220703125; };
          if (this.mMap.getZoom() == 23) { radius = 0.00001953125; chord = 0.000006103515625; };

          // # de voltas da espiral
          var coils = 4;

          // value of theta corresponding to end of last coil
          var thetaMax = coils * 2 * Math.PI;

          // How far to step away from center for each side.
          var awayStep = radius / thetaMax;

          var rotation = 100;

          // For every side, step around and away from center.
          // start at the angle corresponding to a distance of chord 
          // away from centre.
          for (var theta = chord / awayStep, loop = 0; loop < array.length; loop++) {
          //for (var theta = chord / awayStep; theta <= (chord / away) * array.length; ) {
            //
            // How far away from center
            var away = awayStep * theta;
            //
            // How far around the center.
            var around = theta + rotation;
            //
            // Convert 'around' and 'away' to X and Y.
            var x = centerX + Math.cos(around) * away;
            var y = centerY + Math.sin(around) * away; 

            // Now that you know it, do it. 
            spiralCoordinates.push({ lat: x, lng: y });

            // to a first approximation, the points are on a circle
            // so the angle between them is chord/radius
            theta += chord / away;
            //console.log(`theta: ${theta}. +=${chord / away}`);
          }

          /**
           * Desenhar a espiral
           */
          this.spiralPath.setOptions({
            path: spiralCoordinates,
            geodesic: true,
            strokeColor: '#47bac1',
            strokeOpacity: 0.4,
            strokeWeight: 2,
            zIndex: 998
          });
          this.spiralPath.setMap(this.mMap);

          /**
           * Plotar os pontos na espiral
           */
          for (let sc = 1; sc <= array.length; sc++) {
            console.log(`${array.length} array[sc-1].packing_code: ${array[sc - 1].packing_code}`);

            let e = new google.maps.Marker({
              packing_code: array[sc-1].packing_code,
              serial: array[sc-1].serial,
              position: spiralCoordinates[sc],
              battery: array[sc - 1].battery,
              accuracy: array[sc - 1].accuracy,
              icon: { url: '../../../assets/images/pin_unique.png', size: (new google.maps.Size(20, 20)), scaledSize: (new google.maps.Size(20, 20)) },
              zIndex: 999,
              map: this.mMap
            })
            e.setMap(this.mMap);
            this.spiralPoints.push(e);

            /**
            * Trata o clique do pino duplicado
            */
            e.addListener('click', () => {
              console.log('Clique no pino interno');
              console.log('e.position: ' + JSON.stringify(spiralCoordinates[sc].lat));
              console.log('e.position: ' + JSON.stringify(spiralCoordinates[sc].lng));

              this.packMarker = {
                display: true,
                position: spiralCoordinates[sc],
                lat: spiralCoordinates[sc].lat,
                lng: spiralCoordinates[sc].lng,
                start: null,
                packing_code: e.packing_code,
                serial: e.serial,
                battery: `${e.battery.toFixed(2)}%`,
                accuracy: `${e.accuracy || '-'}m`
              };

              //console.log('packMarker: ' + JSON.stringify(this.packMarker.display));
              this.infoWin = new google.maps.InfoWindow({
                content: `<div id="m-iw" style="">
                  <div style="color: #3e4f5f; padding: 10px 6px; font-weight: 700; font-size: 16px;">
                    INFORMAÇÕES</div>
                  <div style="padding: 0px 6px;">
                    <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Embalagem:</span> ${e.packing_code}</p>
                    <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Serial:</span> ${e.serial}</p>
                    <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Bateria:</span> ${e.battery.toFixed(2)}%</p>
                    <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Acurácia:</span> ${e.accuracy || '-'}m</p>
                  </div>
                </div>`});

              this.infoWin.setOptions({ maxWidth: 180 });
              //   google.maps.event.addListener(this.infoWin, 'domready', function () {
              //     console.log('domready aqui. ..');
                
              //     var iwOuter = $('.gm-style-iw');
              //     // iwOuter.children(':nth-child(1)').css({ 'width': '100%' });
              //     // var iwCloseBtn = iwOuter.next();
              //     // iwCloseBtn.css({
              //     //   'right': '11px',
              //     //   'top': '17px',
              //     //   'background-repeat': 'no-repeat',
              //     //   'background-position': 'center',
              //     //   'background-image': 'url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTUwNS45NDMsNi4wNThjLTguMDc3LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDksMEw2LjA1OCw0NzYuNjkzYy04LjA3Nyw4LjA3Ny04LjA3NywyMS4xNzIsMCwyOS4yNDkgICAgQzEwLjA5Niw1MDkuOTgyLDE1LjM5LDUxMiwyMC42ODMsNTEyYzUuMjkzLDAsMTAuNTg2LTIuMDE5LDE0LjYyNS02LjA1OUw1MDUuOTQzLDM1LjMwNiAgICBDNTE0LjAxOSwyNy4yMyw1MTQuMDE5LDE0LjEzNSw1MDUuOTQzLDYuMDU4eiIgZmlsbD0iI0ZGRkZGRiIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTUwNS45NDIsNDc2LjY5NEwzNS4zMDYsNi4wNTljLTguMDc2LTguMDc3LTIxLjE3Mi04LjA3Ny0yOS4yNDgsMGMtOC4wNzcsOC4wNzYtOC4wNzcsMjEuMTcxLDAsMjkuMjQ4bDQ3MC42MzYsNDcwLjYzNiAgICBjNC4wMzgsNC4wMzksOS4zMzIsNi4wNTgsMTQuNjI1LDYuMDU4YzUuMjkzLDAsMTAuNTg3LTIuMDE5LDE0LjYyNC02LjA1N0M1MTQuMDE4LDQ5Ny44NjYsNTE0LjAxOCw0ODQuNzcxLDUwNS45NDIsNDc2LjY5NHoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)'
              //     // });
              //     // iwCloseBtn.children(':nth-child(1)').css({ 'display': 'none' });
              // });
              this.infoWin.open(this.mMap, e);
            });

          }

          //console.log('array: ' + JSON.stringify(array));
          //console.log('spiralCoordinates: ' + JSON.stringify(spiralCoordinates));
        }
      });

    });

    // new MarkerClusterer(this.mMap, this.duplicated, {
    //   maxZoom: 14,
    //   imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    // });
  }

  clearSpiral(){
    //removendo o espiral
    this.spiralPath.setMap(null);
    this.spiralPath.setOptions({
      path: []
    });

    //removendo os pontos da espiral
    while (this.spiralPoints.length > 0) {
      this.spiralPoints[0].setMap(null);
      this.spiralPoints.shift();
      if (this.spiralPoints[0] == undefined) console.log('[0] undefined');
      else console.log(`this.spiralPoints: ${JSON.stringify(this.spiralPoints[0].packing_code)}, ${JSON.stringify(this.spiralPoints[0].serial)}`);
    }

    console.log('.this.spiralPoints.length: ' + this.spiralPoints.length);
    console.log('.flightPath path: ' + JSON.stringify(this.spiralPath.getPath())); 
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

    if (this.showPackings) {  

      //Mostrar embalagens
      this.markers.map(elem => {
        elem.setMap(this.mMap);
      });

      //Mostrar embalagens duplicadas
      this.iconsOfduplicated.map(elem => {
        elem.setMap(this.mMap);
      });
      
    }else{
      //Esconder embalagens
      this.markers.map(elem => {
        elem.setMap(null);
      });
 
      //Esconder embalagens duplicadas
      this.iconsOfduplicated.map(elem => {
        elem.setMap(null);
      });
    }
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
  onEquipmentSelectClear() {
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
    // var iwOuter = $('.gm-style-iw');
    // iwOuter.children().css("display", "block");

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

  startPackWindow(marker) {
    marker.nguiMapComponent.openInfoWindow('pw', marker);
    // var iwOuter = $('.gm-style-iw');
    // iwOuter.children().css("display", "block");

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

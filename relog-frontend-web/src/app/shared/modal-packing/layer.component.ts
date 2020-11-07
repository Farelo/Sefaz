import { Component, OnInit, Input } from "@angular/core";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {
  PackingService,
  SettingsService,
  AlertsService,
  AuthenticationService,
  PositionsService,
  ControlPointsService,
} from "../../servicos/index.service";
import {
  BsDaterangepickerConfig,
  BsLocaleService,
} from "ngx-bootstrap/datepicker";
import { DatePipe } from "@angular/common";
import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
import { constants } from "environments/constants";
import { element } from "protractor";
declare var google: any;

defineLocale("pt-br", ptBrLocale);

@Component({
  selector: "app-alerta",
  templateUrl: "./layer.component.html",
  styleUrls: ["./layer.component.css"],
})
export class LayerModalComponent implements OnInit {
  //Show package details
  public detailsIsCollapsed = true;
  public message = "";

  /*
   * DataPicker
   */
  datePickerConfig = new BsDaterangepickerConfig(); //Configurations
  public initialDate: Date; //Initial date
  public finalDate: Date; //Initial date

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
    accuracy: null,
  };
  public lastPosition: any;

  public controlPoints: any[] = [];
  public plant = {
    display: true,
    lat: null,
    lng: null,
    name: null,
    location: null,
  };

  public logistics = [];
  public logistic = {
    display: true,
    name: null,
  };

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
    private positionService: PositionsService,
    private authenticationService: AuthenticationService, 
    private localeService: BsLocaleService
  ) {
    defineLocale("pt-br", ptBrLocale);
    this.localeService.use("pt-br");

    //Initialize 7 days before now
    let sub = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
    this.initialDate = new Date(sub);
    this.finalDate = new Date();

    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.displayMonths = 1;
    this.datePickerConfig.containerClass = "theme-dark-blue";
  }

  public mMap: any;
  onInitMap(map) {
    this.mMap = map;
    this.getPacking();
    this.getPlants();
  }

  ngOnInit() {}

  getPacking() {
    this.packingService.getPacking(this.packing._id).subscribe((response) => {
      this.mPacking = response;

      if (
        this.mPacking.last_device_data &&
        this.mPacking.last_device_data.message_date_timestamp * 1000 <
          this.initialDate.getTime()
      ) {
        // console.log("caso 1");

        this.initialDate = new Date(
          this.mPacking.last_device_data.message_date_timestamp * 1000
        );

        let initialD = this.formatDate(this.initialDate);
        let finalD = this.formatDate(this.finalDate, true);

        this.getFilteredPositions(this.packing.tag, initialD, finalD, 32000);
      } else {
        // console.log("caso 2");
        let initialD = this.formatDate(this.initialDate);
        let finalD = this.formatDate(this.finalDate, true);

        this.getFilteredPositions(this.packing.tag, initialD, finalD, 32000);
      }
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

      case constants.ALERTS.DEVICE_REMOVED:
        result = 8;
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

  public allPackingMarkers: any = [];
  public infoWin: google.maps.InfoWindow = new google.maps.InfoWindow();
  public mCircle: google.maps.Circle = new google.maps.Circle();

  /**
   * Get the package positions with the filter applied
   * @param codeTag Device tag code
   * @param startDate Date on format yyyy--mm-dd
   * @param finalDate Date on format yyyy--mm-dd
   * @param accuracy Integer value in meters (m)
   */
  getFilteredPositions(
    codeTag: string,
    startDate: any = null,
    finalDate: any = null,
    accuracy: any = null
  ) {
    this.positionService
      .getFilteredPositions(codeTag, startDate, finalDate, accuracy)
      .subscribe((result: any[]) => {
        console.log(result.length);
        
        if (result.length > 1) {
          // this.markers = result.reverse();

          let datePipe = new DatePipe("en");

          this.allPackingMarkers = result.map((elem, idx) => {
            let m = new google.maps.Marker({
              message_date: elem.date,
              // battery: elem.battery.percentage
              //   ? elem.battery.percentage.toFixed(2) + "%"
              //   : "Sem registro",
              accuracy: elem.accuracy,
              position: new google.maps.LatLng(elem.latitude, elem.longitude),
              // icon: this.getPinWithAlert(idx)
            });

            //Hover para mostrar o círculo da acurácia
            google.maps.event.addListener(m, "mouseover", (evt) => {
              this.mCircle = new google.maps.Circle({
                strokeColor: this.getRadiusWithAlert(),
                strokeOpacity: 0.7,
                strokeWeight: 1,
                fillColor: this.getRadiusWithAlert(),
                fillOpacity: 0.2,
                center: m.position,
                radius: m.accuracy,
              });

              this.mCircle.setMap(this.mMap);
            });

            //Saída do Hover para ocultar o círculo da acurácia
            google.maps.event.addListener(m, "mouseout", (evt) => {
              this.mCircle.setMap(null);
            });

            //Evento de click
            google.maps.event.addListener(m, "click", (evt) => {
              // <div class="iw-title">INFORMAÇÕES</div>
              // <div *ngIf="marker.display" class="info-window-content">
              //   <p> <span class="bold">Data da mensagem:</span> {{ (marker.messageDate) | date: 'dd/MM/yy HH:mm:ss' : '+00:00' }}</p>
              //   <p> <span class="bold">Bateria:</span> {{ marker.battery ? ((marker.battery | round) + "%") : "Sem registro" }}</p>
              //   <p> <span class="bold">Acurácia:</span> {{ marker.accuracy ? ((marker.accuracy) + "m") : 'Sem registro' }}</p>
              // </div>

              this.infoWin.setContent(
                `<div style="padding: 0px 6px;">
                      <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Data:</span> ${datePipe.transform(
                        m.message_date,
                        "dd/MM/yy HH:mm:ss",
                        "+00:00"
                      )}</p>
                      <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Acurácia:</span> ${
                        m.accuracy
                      } m</p>
                  </div>`
              );

              this.infoWin.setOptions({ maxWidth: 250 });
              this.infoWin.open(this.mMap, m);
            });

            return m;
          });

          //atualiza o path
          this.updatePaths();
        } else {
          this.isLoading = false;
        }

        // this.getResultQuantity();
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
    if(this.showLastPosition) this.showLastPosition = !this.showLastPosition;
    this.updatePaths();
    // this.getLastPostition();
  }

  /*
   * Plants
   */
  public listOfCircleControlPoints: any;
  public listOfPolygonControlPoints: any;

  getPlants() {
    this.controlPointsService.getAllControlPoint().subscribe((result) => {
      this.controlPoints = result;

      this.listOfCircleControlPoints = result
        .filter((elem) => elem.geofence.type == "c")
        .map((elem) => {
          elem.position = new google.maps.LatLng(
            elem.geofence.coordinates[0].lat,
            elem.geofence.coordinates[0].lng
          );
          return elem;
        });

      this.listOfPolygonControlPoints = result
        .filter((elem) => elem.geofence.type == "p")
        .map((elem) => {
          let lat = elem.geofence.coordinates.map((p) => p.lat);
          let lng = elem.geofence.coordinates.map((p) => p.lng);

          elem.position = {
            lat: (Math.min.apply(null, lat) + Math.max.apply(null, lat)) / 2,
            lng: (Math.min.apply(null, lng) + Math.max.apply(null, lng)) / 2,
          };

          return elem;
        });
    });
  }

  clicked(_a, opt) {
    var marker = _a.target;
    console.log(opt);
    this.marker.lat = marker.getPosition().lat();
    this.marker.lng = marker.getPosition().lng();
    this.marker.messageDate = opt.message_date;
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

    this.clickedPlantDetail(p);
  }

  clickedSupplier(_a, opt) {
    var s = _a.target;

    this.supplier.lat = opt.plant.lat;
    this.supplier.lng = opt.plant.lng;
    this.supplier.name = opt.plant.plant_name;

    this.clickedSupplierDetail(s);
  }

  clickedLogistic(_a, opt) {
    var l = _a.target;

    this.logistic.name = opt.plant.plant_name;
    this.clickedLogisticDetail(l);
  }

  /*
   * Info window
   */
  clickedPlantDetail(plant) {
    plant.nguiMapComponent.openInfoWindow("pw", plant);
  }

  clickedSupplierDetail(supply) {
    supply.nguiMapComponent.openInfoWindow("sw", supply);
  }

  clickedLogisticDetail(supply) {
    supply.nguiMapComponent.openInfoWindow("lw", supply);
  }

  startWindow(marker) {
    marker.nguiMapComponent.openInfoWindow("iw", marker);
  }

  getPosition(event: any) {}

  /**
   * ///////////////////////////////////////
   * Util
   */
  getResultQuantity(): string {
    let result = "";

    if (this.rangedMarkers.length == 0)
      result = `0 posições de ${this.allPackingMarkers.length} disponíveis`;

    if (this.rangedMarkers.length == 1)
      result = `1 posição de ${this.allPackingMarkers.length} disponíveis`;

    if (this.rangedMarkers.length > 1)
      result = `${this.rangedMarkers.length} posições de ${this.allPackingMarkers.length} disponíveis`;

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
    // console.log("updatePaths");
    this.path = [];

    // this.getLastPostition();

    this.rangedMarkers.map((elem) => {
      elem.setMap(null);
      return elem;
    });

    this.rangedMarkers = this.allPackingMarkers.filter((elem) => {
      let result = false;
      if (elem.accuracy <= this.accuracyRange) {
        this.path.push(elem.position);
        result = true;
      }
      return result;
    });

    this.rangedMarkers.map((elem, idx) => {
      elem.setIcon(this.getPinWithAlert(idx));
      elem.setMap(this.mMap);
      return elem;
    });

    // console.log(this.rangedMarkers);

    //centraliza o mapa
    if (this.rangedMarkers.length > 0)
      this.center = this.rangedMarkers[this.rangedMarkers.length - 1].position;
    else
      this.center = this.allPackingMarkers[this.allPackingMarkers.length - 1].position;

    this.isLoading = false;
  }

  lastPositionClicked(event: any) {
    if (!this.showLastPosition) {
      //show only last position
      this.getLastPostition();
    } else {
      //show all positions
      console.log("show all positions");
      this.updatePaths();
    }
  }

  /**
   * This method updates the array 'path' with markers that satisfies the given accuracy.
   */
  getLastPostition() {
    // if (this.rangedMarkers.length > 0) {
    //   this.lastPosition = this.rangedMarkers[this.rangedMarkers.length - 1];

    //   this.center = new google.maps.LatLng(
    //     this.lastPosition.latitude,
    //     this.lastPosition.longitude
    //   );
    // } else {
    //   this.lastPosition = null;
    // }

    if (this.rangedMarkers.length > 0) {
      this.path = [];

      this.rangedMarkers.map((elem) => {
        elem.setMap(null);
        return elem;
      });

      this.lastPosition = this.rangedMarkers[this.rangedMarkers.length - 1];

      this.center = {
        lat: this.lastPosition.position.lat(),
        lng: this.lastPosition.position.lng(),
      };

      this.lastPosition.setIcon(this.getPinWithAlert(1));
      this.lastPosition.setMap(this.mMap);
    }

    this.isLoading = false;
  }

  formatDate(date: any, endDate: boolean = false) {
    let d = date;
    let result = 0;

    if (!endDate) {
      d.setHours(0, 0, 0, 0);
      result = d.getTime() / 1000;
    } else {
      d.setHours(23, 59, 59, 0);
      result = d.getTime() / 1000;
    }

    return result;
  }

  getPin() {
    let pin = null;
    let current_state = this.packing.current_state;

    switch (current_state) {
      case constants.ALERTS.ANALISYS:
        pin = {
          url: "assets/images/pin_analise.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        break;

      case constants.ALERTS.ABSENT:
        pin = {
          url: "assets/images/pin_ausente.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        break;

      case constants.ALERTS.INCORRECT_LOCAL:
        pin = {
          url: "assets/images/pin_incorreto.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        break;

      case constants.ALERTS.LOW_BATTERY:
        pin = {
          url: "assets/images/pin_bateria.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        break;

      case constants.ALERTS.LATE:
        pin = {
          url: "assets/images/pin_atrasado.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        break;

      case constants.ALERTS.PERMANENCE_TIME:
        pin = {
          url: "assets/images/pin_permanencia.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        break;

      case constants.ALERTS.NO_SIGNAL:
        pin = {
          url: "assets/images/pin_sem_sinal.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        break;

      case constants.ALERTS.MISSING:
        pin = {
          url: "assets/images/pin_perdido.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        break;
        
      case constants.ALERTS.DEVICE_REMOVED:
        pin = {
          url: "assets/images/pin_removido.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        break;

      default:
        pin = {
          url: "assets/images/pin_normal.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        break;
    }
    return pin;
  }

  getPinWithAlert(i: number) {
    let pin = null;
    let current_state = this.packing.current_state;

    switch (current_state) {
      case constants.ALERTS.ANALISYS:
        pin = {
          url: "assets/images/pin_analise.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        if (this.rangedMarkers.length > 1) {
          if (i == 0)
            pin = {
              url: "assets/images/pin_analise_first.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
          if (i == this.rangedMarkers.length - 1)
            pin = {
              url: "assets/images/pin_analise_final.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
        }
        break;

      case constants.ALERTS.ABSENT:
        pin = {
          url: "assets/images/pin_ausente.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        if (this.rangedMarkers.length > 1) {
          if (i == 0)
            pin = {
              url: "assets/images/pin_ausente_first.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
          if (i == this.rangedMarkers.length - 1)
            pin = {
              url: "assets/images/pin_ausente_final.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
        }
        break;

      case constants.ALERTS.INCORRECT_LOCAL:
        pin = {
          url: "assets/images/pin_incorreto.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        if (this.rangedMarkers.length > 1) {
          if (i == 0)
            pin = {
              url: "assets/images/pin_incorreto_first.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
          if (i == this.rangedMarkers.length - 1)
            pin = {
              url: "assets/images/pin_incorreto_final.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
        }
        break;

      case constants.ALERTS.LOW_BATTERY:
        pin = {
          url: "assets/images/pin_bateria.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        if (this.rangedMarkers.length > 1) {
          if (i == 0)
            pin = {
              url: "assets/images/pin_bateria_first.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
          if (i == this.rangedMarkers.length - 1)
            pin = {
              url: "assets/images/pin_bateria_final.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
        }
        break;

      case constants.ALERTS.LATE:
        pin = {
          url: "assets/images/pin_atrasado.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        if (this.rangedMarkers.length > 1) {
          if (i == 0)
            pin = {
              url: "assets/images/pin_atrasado_first.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
          if (i == this.rangedMarkers.length - 1)
            pin = {
              url: "assets/images/pin_atrasado_final.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
        }
        break;

      case constants.ALERTS.PERMANENCE_TIME:
        pin = {
          url: "assets/images/pin_permanencia.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        if (this.rangedMarkers.length > 1) {
          if (i == 0)
            pin = {
              url: "assets/images/pin_permanencia_first.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
          if (i == this.rangedMarkers.length - 1)
            pin = {
              url: "assets/images/pin_permanencia_final.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
        }
        break;

      case constants.ALERTS.NO_SIGNAL:
        pin = {
          url: "assets/images/pin_sem_sinal.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        if (this.rangedMarkers.length > 1) {
          if (i == 0)
            pin = {
              url: "assets/images/pin_sem_sinal_first.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
          if (i == this.rangedMarkers.length - 1)
            pin = {
              url: "assets/images/pin_sem_sinal_final.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
        }
        break;

      case constants.ALERTS.MISSING:
        pin = {
          url: "assets/images/pin_perdido.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        if (this.rangedMarkers.length > 1) {
          if (i == 0)
            pin = {
              url: "assets/images/pin_perdido_first.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
          if (i == this.rangedMarkers.length - 1)
            pin = {
              url: "assets/images/pin_perdido_final.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
        }
        break;

      default:
        pin = {
          url: "assets/images/pin_normal.png",
          size: new google.maps.Size(28, 43),
          scaledSize: new google.maps.Size(28, 43),
        };
        if (this.rangedMarkers.length > 1) {
          if (i == 0)
            pin = {
              url: "assets/images/pin_normal_first.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
          if (i == this.rangedMarkers.length - 1)
            pin = {
              url: "assets/images/pin_normal_final.png",
              size: new google.maps.Size(28, 43),
              scaledSize: new google.maps.Size(28, 43),
            };
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

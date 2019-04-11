import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ToastService, GeocodingService, CompaniesService, ControlPointsService, ControlPointTypesService } from 'app/servicos/index.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/first'
import { NguiMap, NguiMapComponent, DrawingManager } from '@ngui/map';

@Component({
  selector: 'app-ponto-de-controle-cadastrar',
  templateUrl: './ponto-de-controle-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PontoDeControleCadastrarComponent implements OnInit {

  public mControlPoint: FormGroup;
  public allCompanies: any[] = [];
  public allTypes: any[] = [];
  public autocomplete: any;
  public address: any = {};
  public center: any;
  public submitted: boolean;
  public zoom = 16;
  public default = {
    lat: 0,
    lng: 0
  }
  public pos: any;
  public geocoder = new google.maps.Geocoder;
  // public pointWasSelected: boolean = false;

  selectedOverlay: any;
  @ViewChild(DrawingManager) drawingManager: DrawingManager;

  constructor(
    private companyService: CompaniesService,
    private controlPointsService: ControlPointsService,
    private controlPointsTypeService: ControlPointTypesService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private toastService: ToastService,
    private fb: FormBuilder,
    private geocodingService: GeocodingService) {

    this.mControlPoint = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^((?!\s{2}).)*$/)]],
      duns: ['', []],
      // lat: ['', [Validators.required]],
      // lng: ['', [Validators.required]],
      full_address: ['', [Validators.required]],
      type: [null, [Validators.required, Validators.minLength(5)]],
      company: [undefined, [Validators.required]]
    });
  }

  ngOnInit() {

    this.prepareMap();
    this.getOthersControlPoints();
    this.fillCompanySelect();
    this.fillTypesSelect();
  }

  public controlPointCircle: google.maps.Circle = null;
  public controlPointPolygon: google.maps.Polygon = null;
  public mGeofence: any;
  //  = {
  //   coordinates: [],
  //   type: '',
  //   radius: 1000
  // };

  generateCircleGeofence(circle: any) {

    this.controlPointCircle = circle;

    this.mGeofence = { coordinates: [] };
    this.mGeofence.coordinates.push({ lat: this.controlPointCircle.getCenter().lat(), lng: this.controlPointCircle.getCenter().lng() });
    this.mGeofence.type = 'c';
    this.mGeofence.radius = this.controlPointCircle.getRadius();

    //console.log(JSON.stringify(this.mGeofence));
  }

  generatePolygonGeofence(poly: any) {

    this.controlPointPolygon = poly;

    let arr = [];
    this.mGeofence = { coordinates: [] };
    this.mGeofence.type = 'p';
    this.controlPointPolygon.getPath().forEach(latLng => arr.push({ lat: latLng.lat(), lng: latLng.lng() }))
    this.mGeofence.coordinates = arr;

    //console.log(JSON.stringify(this.mGeofence));
  }

  prepareMap() {
    this.drawingManager['initialized$'].subscribe((drawingManager: google.maps.drawing.DrawingManager) => {

      /**
       * Circle Listeners 
       */
      google.maps.event.addListener(drawingManager, 'circlecomplete', event => {

        // Get circle center and radius
        let center = event.getCenter();
        let radius = event.getRadius();

        // Remove overlay from map
        event.setMap(null);
        drawingManager.setDrawingMode(null);

        //reseting previous circles
        if (this.controlPointCircle !== null) {
          this.controlPointCircle.setMap(null);
          this.controlPointCircle = null;
        }

        //reseting previous polygons
        if (this.controlPointPolygon !== null) {
          this.controlPointPolygon.setMap(null);
          this.controlPointPolygon = null;
        }

        // Create circle
        this.createCircle(drawingManager, center, radius);
      });

      /**
       * Polygon Listeners 
       */
      google.maps.event.addListener(drawingManager, 'polygoncomplete', polygon => {

        //listener when a vertice is dragged
        google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
          this.generatePolygonGeofence(polygon);
        });

        //listener when a new vertice is created
        google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
          this.generatePolygonGeofence(polygon);
        });

        //reset the drawing control
        drawingManager.setDrawingMode(null);

        //reseting previous circlesc
        if (this.controlPointCircle !== null) {
          this.controlPointCircle.setMap(null);
          this.controlPointCircle = null;
        }

        //reseting previous polygons
        if (this.controlPointPolygon !== null) {
          this.controlPointPolygon.setMap(null);
          this.controlPointPolygon = null;
        }

        this.generatePolygonGeofence(polygon);
      });
    });
  }

  createCircle(drawingManager: google.maps.drawing.DrawingManager, center: any, radius: any) {

    console.log('createCircle');

    if (this.controlPointCircle !== null) {
      this.controlPointCircle.setMap(null);
      this.controlPointCircle = null;
    }

    this.controlPointCircle = new google.maps.Circle({
      fillColor: '#0044a8',
      fillOpacity: 0.2,
      strokeWeight: 1,
      strokeColor: '#0044a8',
      strokeOpacity: 0.4,
      draggable: true,
      editable: true,
      map: drawingManager.getMap(),
      center: center,
      radius: radius
    });

    this.generateCircleGeofence(this.controlPointCircle);

    google.maps.event.addListener(this.controlPointCircle, 'radius_changed', event => {

      console.log('circle radius changed');
      this.generateCircleGeofence(this.controlPointCircle);
    });

    google.maps.event.addListener(this.controlPointCircle, 'center_changed', event => {

      console.log('circle center changed');
      this.generateCircleGeofence(this.controlPointCircle);
    });
  }

  /**
   * Fill the select of companies
   */
  fillCompanySelect() {

    this.companyService.getAllCompanies().subscribe(result => {
      this.allCompanies = result;
    }, err => console.error(err));
  }

  /**
   * Fill the select of types
   */
  fillTypesSelect() {

    this.controlPointsTypeService.getAllTypes().subscribe(result => {
      this.allTypes = result;
    }, err => console.error(err));
  }

  onAddItem(event: any) {

    // console.log(event);

    if (!event._id) {

      if (event.name.length < 5) {
        this.fillTypesSelect();
        this.mControlPoint.controls.type.setErrors({ minlength: true });
        return false;
      }

      if (event.name.length > 50) {
        this.fillTypesSelect();
        this.mControlPoint.controls.type.setErrors({ maxlength: true });
        return false;
      }

      this.controlPointsTypeService.createType({ name: event.name }).subscribe(result => {
        this.controlPointsTypeService.getAllTypes().toPromise().then(() => {
          this.mControlPoint.controls.type.setValue(result);
        });
      }, err => console.error(err));
    }
  }

  /**
   * Click on submit button
   * 
   * @param param The form group 
   */
  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    //  console.log(value);
    // console.log(valid);
    // console.log('submit');
    //  console.log(this.mControlPoint);

    this.submitted = true;

    if (valid && this.mGeofence.coordinates.length > 0) {

      value.type = this.mControlPoint.controls.type.value._id;
      value.company = this.mControlPoint.controls.company.value._id;
      value.geofence = this.mGeofence;

      // console.log(value);
      this.finishRegister(value);
    }
  }

  finishRegister(value) {
    this.controlPointsService.createControlPoint(value).subscribe(result => {

      let message = {
        title: "Ponto de controle cadastrado",
        body: "O ponto de controle foi cadastrado com sucesso"
      };
      this.toastService.show('/rc/cadastros/ponto', message);
    }, err => this.toastService.error(err));
  }

  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }

  placeChanged(place: any) {
    this.center = place.geometry.location;

    // for (let i = 0; i < place.address_components.length; i++) {
    //   let addressType = place.address_components[i].types[0];
    //   this.address = place.address_components[i].long_name;
    //   console.log(place.address_components[i]);
    // }

    this.address = place.formatted_address;
    this.mControlPoint.controls.full_address.setValue(this.address);

    // console.log(this.address);

    // this.mControlPoint.controls.lat.setValue(0);
    // this.mControlPoint.controls.lng.setValue(0);

    // this.pointWasSelected = false;

    this.zoom = 16;
    this.ref.detectChanges();

    //

    //this.drawingManager.drawingControl.setOptions({ drawingControl: true}); 
    //this.drawingManager.setMap(map);
  }

  // onMapReady(map) {

  //   let origin = new google.maps.LatLng(map.center ? map.center.lat() : this.default.lat, map.center ? map.center.lng() : this.default.lng);

  //   if (map.center) {
  //     this.geocodingService.geocode(origin).subscribe(results => {
  //       this.mControlPoint.controls.full_address.setValue(results[1].formatted_address), err => console.log(err)
  //     });
  //   }

  //   this.mControlPoint.controls.lat.setValue(map.center ? map.center.lat() : this.default.lat);
  //   this.mControlPoint.controls.lng.setValue(map.center ? map.center.lng() : this.default.lng);
  // }

  // onClick(event, str) {

  //   this.pointWasSelected = true;

  //   if (event instanceof MouseEvent) {
  //     return;
  //   }

  //   this.pos = event.latLng;
  //   this.geocodingService.geocode(event.latLng).subscribe(results => {
  //     this.mControlPoint.controls.full_address.setValue(results[1].formatted_address);
  //   });
  //   this.mControlPoint.controls.lat.setValue(event.latLng.lat());
  //   this.mControlPoint.controls.lng.setValue(event.latLng.lng());
  //   event.target.panTo(event.latLng);
  // }

  validateName(event: any) {
    if (!this.mControlPoint.get('name').errors) {

      this.validateNotTakenLoading = true;
      this.controlPointsService.getAllControlPoint({ name: this.mControlPoint.get('name').value }).subscribe(result => {

        if (result.length == 0)
          this.mControlPoint.get('name').setErrors(null);
        else
          this.mControlPoint.get('name').setErrors({ uniqueValidation: true });

        this.validateNotTakenLoading = false;
      });
    }
  }

  public validateNotTakenLoading: boolean;
  // validateNotTaken(control: AbstractControl) {
  //   this.validateNotTakenLoading = true;
  //   return control
  //     .valueChanges
  //     .delay(800)
  //     .debounceTime(800)
  //     .distinctUntilChanged()
  //     .switchMap(value => this.controlPointsService.getAllControlPoint({ name: control.value }))
  //     .map(res => {
  //       this.validateNotTakenLoading = false;

  //       if (res.length == 0) {
  //         console.log('empty')
  //         return control.setErrors(null);
  //       } else {
  //         console.log('not empty')
  //         return control.setErrors({ uniqueValidation: 'code already exist' })
  //       }
  //     })
  // }


  /**
   * Methods relative to all others control points
   */

  public plant = {
    display: true,
    lat: null,
    lng: null,
    name: null,
    location: null
  };

  clickedPlant(_a, opt) {
    var p = _a.target;
    this.plant.lat = p.lat;
    this.plant.lng = p.lng;
    this.plant.name = opt.name;
    // this.plant.location = opt.location;

    this.clickedPlantDetail(p);
  }


  /*
   * Info window 
   */
  clickedPlantDetail(plant) {
    plant.nguiMapComponent.openInfoWindow('pw', plant);
  }

  public listOfCircleControlPoints: any;  //Control Points arrays
  public listOfPolygonControlPoints: any; //Control Points arrays

  getOthersControlPoints() {
    this.controlPointsService.getAllControlPoint().subscribe(result => {

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

    });
  }

}


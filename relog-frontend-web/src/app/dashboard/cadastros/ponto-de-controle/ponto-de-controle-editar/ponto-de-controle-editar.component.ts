import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ToastService, GeocodingService, CompaniesService, ControlPointsService, ControlPointTypesService } from 'app/servicos/index.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import { Subscription } from 'rxjs';
import { DrawingManager } from '@ngui/map';

@Component({
  selector: 'app-ponto-de-controle-editar',
  templateUrl: './ponto-de-controle-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PontoDeControleEditarComponent implements OnInit {

  public mControlPoint: FormGroup;
  public mActualControlPoint: any = { geofence: { coordinates: [] } };
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

  public inscricao: Subscription;
  public mId: string;
  public pointWasSelected: boolean = false;
  public controlPointType: any;

  public polygonEdited: boolean = false;
  public circleEdited: boolean = false;

  selectedOverlay: any;
  @ViewChild(DrawingManager) drawingManager: DrawingManager;

  constructor(
    private companyService: CompaniesService,
    private controlPointsService: ControlPointsService,
    private controlPointsTypeService: ControlPointTypesService,
    private route: ActivatedRoute,
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
      type: [undefined, [Validators.required]],
      company: [undefined, [Validators.required]]
    });
  }


  ngOnInit() {

    this.fillCompanySelect();
    this.fillTypesSelect();
    this.retrieveControlPoint();
    this.prepareMap();
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


  /**
   * 
   */
  retrieveControlPoint() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.controlPointsService.getControlPoint(this.mId).subscribe(result => {

        this.mActualControlPoint = result;
        this.mGeofence = this.mActualControlPoint.geofence;

        this.printGeofence();

        (<FormGroup>this.mControlPoint).patchValue(result, { onlySelf: true });

        this.pointWasSelected = true;
      });
    });
  }

  printGeofence(){
    
    if (this.mGeofence.type == 'p')
      this.calculatePolygonCenter();
    else
      this.calculateCircleCenter();
  }

  calculatePolygonCenter(){

    let lat = this.mGeofence.coordinates.map(p =>  p.lat);
    let lng = this.mGeofence.coordinates.map(p =>  p.lng);

    //new google.maps.LatLng();
    this.center = {
      lat: (Math.min.apply(null, lat) + Math.max.apply(null, lat))/2,
      lng: (Math.min.apply(null, lng) + Math.max.apply(null, lng))/2
    }
    // console.log('center: ' + this.center);
  }

  calculateCircleCenter(){
    this.center = this.mGeofence.coordinates[0];
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  public controlPointCircle: google.maps.Circle = null;
  public controlPointPolygon: google.maps.Polygon = null;
  public mGeofence: any = { coordinates: [] };
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

    // console.log(JSON.stringify(this.mGeofence));
  }

  generatePolygonGeofence(poly: any) {

    this.controlPointPolygon = poly;

    let arr = [];
    this.mGeofence = { coordinates: [] };
    this.mGeofence.type = 'p';
    this.controlPointPolygon.getPath().forEach(latLng => arr.push({ lat: latLng.lat(), lng: latLng.lng() }))
    this.mGeofence.coordinates = arr;

    // console.log(JSON.stringify(this.mGeofence));
  }

  dragPolygon(event: any){
    // console.log(JSON.stringify('aquiiii...'));
  }

  prepareMap() {
    this.drawingManager['initialized$'].subscribe(dm => {

      /**
       * Circle
       */
      google.maps.event.addListener(dm, 'circlecomplete', circle => {

        this.circleEdited = true;

        //listener when radius is changed
        google.maps.event.addListener(circle, 'radius_changed', () => {
          this.generateCircleGeofence(circle);
        });

        //listener when cender is dragged
        google.maps.event.addListener(circle, 'center_changed', () => {
          this.generateCircleGeofence(circle);
        });

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

        this.generateCircleGeofence(circle);
      });


      /**
       * Polygon
       */
      google.maps.event.addListener(dm, 'polygoncomplete', polygon => {

        this.polygonEdited = true;

        //listener when a vertice is dragged
        google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
          this.generatePolygonGeofence(polygon);
        });

        //listener when a new vertice is created
        google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
          this.generatePolygonGeofence(polygon);
        });

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

        this.generatePolygonGeofence(polygon);
      });

    });
  }

  onAddItem(event: any) {

    //console.log(event);
    
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

    // console.log(value);
    // console.log(valid);
    // console.log(this.mControlPoint);
    // console.log(this.pointWasSelected);

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
    this.controlPointsService.editControlPoint(this.mId, value).subscribe(result => {

      let message = {
        title: "Ponto de controle atualizado",
        body: "O ponto de controle foi atualizado com sucesso"
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
    //   this.address[addressType] = place.address_components[i].long_name;
    // }

    this.address = place.formatted_address;
    this.mControlPoint.controls.full_address.setValue(this.address);

    // this.mControlPoint.controls.lat.setValue(0);
    // this.mControlPoint.controls.lng.setValue(0);

    this.zoom = 18;
    this.ref.detectChanges();
  }


  // onClick(event, str) {

  //   this.pointWasSelected = true;

  //   if (event instanceof MouseEvent) {
  //     return;
  //   }

  //   this.pos = event.latLng;
  //   this.geocodingService.geocode(event.latLng).subscribe(results => {
  //     // console.log(results);
  //     // console.log(results[1].formatted_address);
  //     this.mControlPoint.controls.full_address.setValue(results[1].formatted_address);
  //   });
  //   this.mControlPoint.controls.lat.setValue(event.latLng.lat());
  //   this.mControlPoint.controls.lng.setValue(event.latLng.lng());
  //   event.target.panTo(event.latLng);
  // }

  validateName(event: any){
    
    if (!this.mControlPoint.get('name').errors && (this.mActualControlPoint.name !== this.mControlPoint.get('name').value)) {

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

  public validateNotTakenLoading: boolean = false;
  // validateNotTaken(control: AbstractControl) {
  //   this.validateNotTakenLoading = true;
  //   // console.log('this.mActualPacking.tag.code: ' + this.mActualPacking.tag.code);
  //   // console.log('control.value: ' + control.value);

  //   if (this.mActualControlPoint.name == control.value) {
  //     // console.log('equal');
  //     this.validateNotTakenLoading = false;
  //     return new Promise((resolve, reject) => resolve(null));
  //   }

  //   return control
  //     .valueChanges
  //     .delay(800)
  //     .debounceTime(800)
  //     .distinctUntilChanged()
  //     .switchMap(value => this.controlPointsService.getAllControlPoint({ name: control.value }))
  //     .map(res => {

  //       this.validateNotTakenLoading = false;
  //       if (res.length == 0) {
  //         // console.log('empty');
  //         return control.setErrors(null);
  //       } else {
  //         // console.log('not empty');
  //         return control.setErrors({ uniqueValidation: 'code already exist' })
  //       }
  //     });
  // }
}

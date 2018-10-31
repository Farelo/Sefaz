import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ToastService, GeocodingService, CompaniesService, ControlPointsService, ControlPointTypesService } from 'app/servicos/index.service';
import { Router } from '@angular/router'; 
import 'rxjs/add/operator/first'

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
  public pointWasSelected: boolean = false;

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
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^((?!\s{2}).)*$/)], this.validateNotTaken.bind(this)],
      duns: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      full_address: ['', [Validators.required]],
      type: [undefined, [Validators.required]],
      company: [undefined, [Validators.required]]
    });
  }


  ngOnInit() {

    this.fillCompanySelect();
    this.fillTypesSelect(); 
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

    this.controlPointsTypeService.getAllType().subscribe(result => {
      this.allTypes = result;
    }, err => console.error(err));
  }

  onAddItem(event: any){

    console.log('event');
    console.log(event);

    this.controlPointsTypeService.createType({ name: event.name }).subscribe(result => {
      
      console.log('result');
      console.log(result);

      this.controlPointsTypeService.getAllType().toPromise().then(() => {

        this.mControlPoint.controls.type.setValue(result);

        console.log('...');
        console.log(this.mControlPoint);
      });
    }, err => console.error(err));
  }

  /**
   * Click on submit button
   * 
   * @param param The form group 
   */
  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    // console.log(value);
    // console.log(valid);
    console.log('submit');
    console.log(this.mControlPoint);

    this.submitted = true;

    if (valid && this.pointWasSelected) {  
      
      value.type = this.mControlPoint.controls.type.value._id;
      value.company = this.mControlPoint.controls.company.value._id; 

      console.log(value);
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

  placeChanged(place) {
    this.center = place.geometry.location;
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      this.address[addressType] = place.address_components[i].long_name;
    }
    
    this.mControlPoint.controls.lat.setValue(0);
    this.mControlPoint.controls.lng.setValue(0);

    this.pointWasSelected = false;

    this.zoom = 16;
    this.ref.detectChanges();
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

  onClick(event, str) {

    this.pointWasSelected = true;

    if (event instanceof MouseEvent) {
      return;
    }

    this.pos = event.latLng;
    this.geocodingService.geocode(event.latLng).subscribe(results => {
      this.mControlPoint.controls.full_address.setValue(results[1].formatted_address);
    });
    this.mControlPoint.controls.lat.setValue(event.latLng.lat());
    this.mControlPoint.controls.lng.setValue(event.latLng.lng());
    event.target.panTo(event.latLng);
  }


  public validateNotTakenLoading: boolean;
  validateNotTaken(control: AbstractControl) {
    this.validateNotTakenLoading = true;
    return control
      .valueChanges
      .delay(800)
      .debounceTime(800)
      .distinctUntilChanged()
      .switchMap(value => this.controlPointsService.getAllControlPoint({ name: control.value }))
      .map(res => {
        this.validateNotTakenLoading = false;

        if (res.length == 0) {
          console.log('empty')
          return control.setErrors(null);
        } else {
          console.log('not empty')
          return control.setErrors({ uniqueValidation: 'code already exist' })
        }
      })
  }
  
}

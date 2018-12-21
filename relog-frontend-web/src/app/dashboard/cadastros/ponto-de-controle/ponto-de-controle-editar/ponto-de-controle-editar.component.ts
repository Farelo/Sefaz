import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ToastService, GeocodingService, CompaniesService, ControlPointsService, ControlPointTypesService } from 'app/servicos/index.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ponto-de-controle-editar',
  templateUrl: './ponto-de-controle-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PontoDeControleEditarComponent implements OnInit {

  public mControlPoint: FormGroup;
  public mActualControlPoint: any;
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
    this.retrieveControlPoint();
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


  /**
   * 
   */
  retrieveControlPoint() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.controlPointsService.getControlPoint(this.mId).subscribe(result => {

        this.mActualControlPoint = result;
        (<FormGroup>this.mControlPoint).patchValue(result, { onlySelf: true });

        this.pointWasSelected = true;

        console.log('recuperado');
        console.log(this.mControlPoint);
        
        // this.controlPointType = this.allTypes.filter(elem => {
        //   return elem.name == result.type;
        // })[0];
        
        //console.log(this.controlPointType);

        //center map
        this.center = new google.maps.LatLng(this.mControlPoint.controls.lat.value, this.mControlPoint.controls.lng.value);
        this.pos = new google.maps.LatLng(this.mControlPoint.controls.lat.value, this.mControlPoint.controls.lng.value);
      });
    });
  }


  ngOnDestroy() {
    this.inscricao.unsubscribe();
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
        this.controlPointsTypeService.getAllType().toPromise().then(() => {
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

    if (valid && this.pointWasSelected) {  

      value.type = this.mControlPoint.controls.type.value._id;
      value.company = this.mControlPoint.controls.company.value._id;

      console.log(value);
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


  placeChanged(place) {
    this.center = place.geometry.location;
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      this.address[addressType] = place.address_components[i].long_name;
    }

    this.mControlPoint.controls.lat.setValue(0);
    this.mControlPoint.controls.lng.setValue(0);

    this.zoom = 18;
    this.ref.detectChanges();
  }


  onClick(event, str) {

    this.pointWasSelected = true;

    if (event instanceof MouseEvent) {
      return;
    }

    this.pos = event.latLng;
    this.geocodingService.geocode(event.latLng).subscribe(results => {
      // console.log(results);
      // console.log(results[1].formatted_address);
      this.mControlPoint.controls.full_address.setValue(results[1].formatted_address);
    });
    this.mControlPoint.controls.lat.setValue(event.latLng.lat());
    this.mControlPoint.controls.lng.setValue(event.latLng.lng());
    event.target.panTo(event.latLng);
  }

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

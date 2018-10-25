import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService, GeocodingService, CompaniesService, ControlPointsService } from 'app/servicos/index.service';
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
  public zoom = 14;
  public default = {
    lat: 0,
    lng: 0
  }
  public pos: any;
  public geocoder = new google.maps.Geocoder;

  public inscricao: Subscription;
  public mId: string;
  
  constructor(
    private companyService: CompaniesService,
    private controlPointsService: ControlPointsService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private toastService: ToastService,
    private fb: FormBuilder,
    private geocodingService: GeocodingService) {

    this.mControlPoint = this.fb.group({
      name: ['', [Validators.required]],
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
    this.retrieveUser();
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

    this.allTypes
      .push({ label: "Fábrica", name: "factory" },
        { label: "Fornecedor", name: "supplier" },
        { label: "Operador Logístico", name: "op_log" });
  }

  /**
   * 
   */
  retrieveUser() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.controlPointsService.getControlPoint(this.mId).subscribe(result => {

        // let actual = {
        //   type: result.type,
        //   name: result.name,
        //   duns: result.duns,
        //   lat: result.lat,
        //   lng: result.lng,
        //   full_address: result.full_address,
        // };

        this.mActualControlPoint = result;
        (<FormGroup>this.mControlPoint).patchValue(result, { onlySelf: true });
        //(<FormGroup>this.mControlPoint).patchValue(actual, { onlySelf: true });
      });
    });
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

    this.submitted = true;

    if (valid) {

      console.log(value);

      value.type = this.mControlPoint.controls.type.value.name;
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
    this.zoom = 18;
    this.ref.detectChanges();
  }

  onMapReady(map) {

    let origin = new google.maps.LatLng(map.center ? map.center.lat() : this.default.lat, map.center ? map.center.lng() : this.default.lng);

    if (map.center) {
      this.geocodingService.geocode(origin).subscribe(results => {
        this.mControlPoint.controls.full_address.setValue(results[1].formatted_address), err => console.log(err)
      });
    }

    this.mControlPoint.controls.lat.setValue(map.center ? map.center.lat() : this.default.lat);
    this.mControlPoint.controls.lng.setValue(map.center ? map.center.lng() : this.default.lng);
  }

  onClick(event, str) {

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

}

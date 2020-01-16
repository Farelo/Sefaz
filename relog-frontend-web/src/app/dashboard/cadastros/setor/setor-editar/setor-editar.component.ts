import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GeocodingService, ToastService, DepartmentService, ControlPointsService } from '../../../../servicos/index.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-setor-editar',
  templateUrl: './setor-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class SetorEditarComponent implements OnInit {

  public mDepartment: FormGroup;
  public allControlPoints = [];
  public address: any = {};
  public center: any;
  public pos: any;
  public zoom = 20;
  public default = {
    lat: 0,
    lng: 0
  }
  public geocoder = new google.maps.Geocoder;

  public inscricao: Subscription;
  public mId: string = '';
  public mActualDepartment: any = {};

  constructor(public translate: TranslateService,
    private controlPointsService: ControlPointsService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private fb: FormBuilder,
    private geocodingService: GeocodingService) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

  ngOnInit() {
    this.configureFormGroup();
    this.loadControlPoints();
    this.retrieveUser();
  }

  loadControlPoints(): void {

    this.controlPointsService.getAllControlPoint().subscribe(result => {
      this.allControlPoints = result;
    }, err => { console.log(err) });
  }

  retrieveUser() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.departmentService.getDepartment(this.mId).subscribe(result => {

        // let actualValues = {
        //   code: result.code,
        //   company: result.company,
        //   control_points: result.control_points
        // };
        //console.log('this.actualValues...' + JSON.stringify(actualValues));
        this.mActualDepartment = result;
        (<FormGroup>this.mDepartment).patchValue(result, { onlySelf: true });

        this.center = new google.maps.LatLng(this.mActualDepartment.lat, this.mActualDepartment.lng);
        this.pos = new google.maps.LatLng(this.mActualDepartment.lat, this.mActualDepartment.lng);

        //console.log(this.mDepartment);
      });
    });
  }

  onSubmit({ value, valid }): void {

    value.control_point = value.control_point._id;
    // console.log(value);

    if (valid) {
      this.departmentService.editDepartment(this.mId, value).subscribe(result => {
        this.toastService.edit('/rc/cadastros/setor', 'Departamento');
      }, err => this.toastService.error(err));
    }
  }

  onClick(event, str) {

    if (event instanceof MouseEvent) return;

    this.pos = event.latLng;

    //update form group
    this.mDepartment.controls.lat.setValue(event.latLng.lat());
    this.mDepartment.controls.lng.setValue(event.latLng.lng());

    //update form map
    event.target.panTo(event.latLng);
  }

  onChange(event) {

    if (event) {
      this.pos = new google.maps.LatLng(event.lat, event.lng);
      this.center = this.pos;
      this.zoom = 20;

      //update on form group
      this.mDepartment.controls.lat.setValue(event.lat);
      this.mDepartment.controls.lng.setValue(event.lng);
    }
  }


  configureFormGroup() {

    this.mDepartment = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^((?!\s{2}).)*$/)]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      control_point: ['', [Validators.required]]
    });
  }

}

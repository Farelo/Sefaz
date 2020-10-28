import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { Department } from '../../../../shared/models/department';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GeocodingService, ToastService, DepartmentService, ControlPointsService} from '../../../../servicos/index.service';

@Component({
  selector: 'app-setor-cadastrar',
  templateUrl: './setor-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class SetorCadastrarComponent implements OnInit {

  public mDepartment: FormGroup;
  public allControlPoints = [];
  public address: any = {};
  public center: any;
  public pos: any;
  public zoom = 14;
  public default = {
    lat: 0,
    lng: 0
  }
  public geocoder = new google.maps.Geocoder;

  constructor(
    private controlPointsService: ControlPointsService,
    private departmentService: DepartmentService,
    private router: Router, 
    private toastService: ToastService,
    private fb: FormBuilder,
    private geocodingService: GeocodingService) {
  
  }

  ngOnInit() {
    this.configureFormGroup();
    this.loadControlPoints();
  }

  onSubmit({ value, valid }): void {

    value.control_point = value.control_point._id;
    // console.log(value);
    
    if(valid){
      this.departmentService.createDepartment(value).subscribe(result => {
        this.toastService.success('/rc/cadastros/setor', 'Departamento');
      }, err => this.toastService.error(err));
    }
  }

  onMapReady(map) {
  
    this.mDepartment.controls.lat.setValue(map.center ? map.center.lat() : this.default.lat);
    this.mDepartment.controls.lng.setValue(map.center ? map.center.lng() : this.default.lng);
  }

  onClick(event) {

    if (event instanceof MouseEvent) return;

    this.pos = event.latLng;

    //update form group
    this.mDepartment.controls.lat.setValue(event.latLng.lat());
    this.mDepartment.controls.lng.setValue(event.latLng.lng());

    //update form map
    event.target.panTo(event.latLng);
  }

  onChange(event){
    console.log(event);

    if(event){
      //this.pos = new google.maps.LatLng(event.lat,event.lng);

      if(event.geofence.type == 'c'){
        this.calculateCircleCenter(event);
      } else{
        this.calculatePolygonCenter(event);
      }

      // this.pos = event.full_address;
      this.pos = this.center;
      this.zoom = 20;

      console.log(this.center);

      //update on form group
      this.mDepartment.controls.lat.setValue(this.center.lat);
      this.mDepartment.controls.lng.setValue(this.center.lng);
    }
  }

   calculatePolygonCenter(event: any){

    let lat = event.geofence.coordinates.map(p =>  p.lat);
    let lng = event.geofence.coordinates.map(p =>  p.lng);

    //new google.maps.LatLng();
    this.center = {
      lat: (Math.min.apply(null, lat) + Math.max.apply(null, lat))/2,
      lng: (Math.min.apply(null, lng) + Math.max.apply(null, lng))/2
    }
    console.log('center: ' + JSON.stringify(this.center));
  }

  calculateCircleCenter(event: any){
    this.center = event.geofence.coordinates[0];
  }



  loadControlPoints():void {

    this.controlPointsService.getAllControlPoint().subscribe(result => {
        this.allControlPoints = result;
      }, err => { console.log(err) });
  }

  configureFormGroup(){

    this.mDepartment = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^((?!\s{2}).)*$/)]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      control_point: [undefined, [Validators.required]]
    });
  }

}

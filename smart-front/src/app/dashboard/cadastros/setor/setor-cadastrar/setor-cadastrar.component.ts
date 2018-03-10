import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { DepartmentService } from '../../../../servicos/departments.service';
import { Department } from '../../../../shared/models/department';
import { PlantsService } from '../../../../servicos/plants.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../servicos/toast.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GeocodingService } from '../../../../servicos/geocoding.service';

@Component({
  selector: 'app-setor-cadastrar',
  templateUrl: './setor-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class SetorCadastrarComponent implements OnInit {
  public department: FormGroup;
  public plants = [];
  public address: any = {};
  public center: any;
  public pos: any;
  public zoom = 14;
  public geocoder = new google.maps.Geocoder;

  constructor(
    private PlantsService: PlantsService,
    private DepartmentService: DepartmentService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private toastService: ToastService,
    private fb: FormBuilder,
    private geocodingService: GeocodingService
  ) {

    this.department = this.fb.group({
      name: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      plant: ['', [Validators.required]]
    });

  }

  onSubmit({ value, valid }: { value: Department, valid: boolean }): void {

    if(valid){
      this.DepartmentService
      .createDepartment(value)
      .subscribe(result => {
        this.toastService.success('/rc/cadastros/setor', 'Setor');
      }, err => this.toastService.error(err));
    }
  }

  onMapReady(map) {

    this.department.controls.lat.setValue(map.center.lat());
    this.department.controls.lng.setValue(map.center.lng());
  }

  onClick(event, str) {
    if (event instanceof MouseEvent) {
      return;
    }

    this.pos = event.latLng;

    this.department.controls.lat.setValue(event.latLng.lat());
    this.department.controls.lng.setValue(event.latLng.lng());
    event.target.panTo(event.latLng);
  }

  onChange(event){
    if(event){
      this.pos = new google.maps.LatLng(event.lat,event.lng);
      this.center = this.pos;
      this.zoom = 18;
      this.department.controls.lat.setValue(event.lat);
      this.department.controls.lng.setValue(event.lng);
    }

  }

  loadPlants():void {
      this.PlantsService.retrieveAll().subscribe(result => this.plants = result);
  }

  ngOnInit() {
    this.loadPlants();

  }

}

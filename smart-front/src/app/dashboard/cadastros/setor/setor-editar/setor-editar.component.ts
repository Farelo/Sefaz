import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { DepartmentService } from '../../../../servicos/departments.service';
import { Department } from '../../../../shared/models/department';
import { PlantsService } from '../../../../servicos/plants.service';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../servicos/toast.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GeocodingService } from '../../../../servicos/geocoding.service';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-setor-editar',
  templateUrl: './setor-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class SetorEditarComponent implements OnInit {
  public department: FormGroup;
  public inscricao: Subscription;
  public plants = [];
  public address: any = {};
  public center: any;
  public pos: any;
  public geocoder = new google.maps.Geocoder;

  constructor(
    private PlantsService: PlantsService,
    private DepartmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private toastService: ToastService,
    private fb: FormBuilder,
    private geocodingService: GeocodingService
  ) { }

  onSubmit({ value, valid }: { value: Department, valid: boolean }): void {

    if(valid){

      this.DepartmentService
      .updateDepartment(value._id,value)
      .subscribe(result => {
        this.toastService.edit('/rc/cadastros/setor', 'Setor');
      }, err => this.toastService.error(err));
    }
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
      this.department.controls.lat.setValue(event.lat);
      this.department.controls.lng.setValue(event.lng);
    }

  }

  loadPlants():void {
      this.PlantsService.retrieveAll().subscribe(result => {

        let plant = result.data.filter( o => String(this.department.controls.plant.value._id) === String(o._id))[0];

        this.department.controls.plant.setValue(plant);
        this.plants = result.data;
      });
  }

  ngOnInit() {

    this.department = this.fb.group({
      name: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      plant: ['', [Validators.required]],
      _id:['', [Validators.required]],
      __v:['']
    });
    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params ['id'];
        this.DepartmentService.retrieveDepartment(id).subscribe(result => {

          (<FormGroup>this.department)
                  .setValue(result.data, { onlySelf: true });

          this.center = { lat: this.department.controls.lat.value, lng: this.department.controls.lng.value };
          this.pos = [this.department.controls.lat.value,this.department.controls.lng.value];
          this.loadPlants();
        });
      }
    )

  }

}

import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { PackingService } from '../../../../servicos/packings.service';;
import { Packing } from '../../../../shared/models/packing';
import { SuppliersService } from '../../../../servicos/suppliers.service';
import { Supplier } from '../../../../shared/models/supplier';
import { PlantsService } from '../../../../servicos/plants.service';
import { RoutesService } from '../../../../servicos/routes.service';;
import { Route } from '../../../../shared/models/route';
import { Router } from '@angular/router';
import { DirectionsRenderer } from '@ngui/map';
import { ToastService } from '../../../../servicos/toast.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

declare var $:any;
@Component({
  selector: 'app-rotas-cadastrar',
  templateUrl: './rotas-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class RotasCadastrarComponent implements OnInit {
  @ViewChild(DirectionsRenderer) directionsRendererDirective: DirectionsRenderer;
  public time_min: NgbTimeStruct = {hour: 0, minute: 0, second: 0};
  public time_max: NgbTimeStruct = {hour: 0, minute: 0, second: 0};
  public directionsRenderer: google.maps.DirectionsRenderer;
  public directionsResult: google.maps.DirectionsResult;
  public direction: any = {
    origin: '',
    destination: '',
    travelMode: 'DRIVING'
  };
  public autocomplete: any;
  public address: any = {};
  public center: any;
  public pos: any;
  public existPacking = true;
  public directions = false;
  public plant_factory: any = "";
  public route: FormGroup;
  public suppliers =  [];
  public plants = [];
  public packings = [];
  public choiced = false;
  public choice_equipament = false;


  constructor(
    private PlantsService: PlantsService,
    private PackingService: PackingService,
    private suppliersService: SuppliersService,
    private RoutesService: RoutesService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {

  }


  onSubmit({ value, valid }: { value: any, valid: boolean }): void {
    //fazer a tranformação para segundo, somar e dar o resultado.
    let partial_min = this.time_min.hour * 1000 * 60 * 60 * 24 ;
    partial_min = partial_min + this.time_min.minute * 1000 * 60 * 60  ;
    partial_min = partial_min + this.time_min.second * 1000 * 60 ;
    let partial_max = this.time_max.hour * 1000 * 60 * 60 * 24 ;
    partial_max = partial_max + this.time_max.minute * 1000 * 60 * 60  ;
    partial_max = partial_max + this.time_max.second * 1000 * 60 ;


    this.route['controls'].hashPacking.setValue(this.route['controls'].supplier.value._id + this.route['controls'].packing_code.value.id);
    value.hashPacking = this.route['controls'].supplier.value._id + this.route['controls'].packing_code.value.id;
    value.time.max = partial_max;
    value.time.min = partial_min;


    if(this.route.valid){
      value.project = value.packing_code.project._id;
      value.packing_code = value.packing_code.id;

      this.RoutesService.createRoute(value)
        .subscribe(result => {
          this.toastService.success('/rc/cadastros/rotas', 'Rota');
        }, err => this.toastService.error(err));

    }
  }

  directionsChanged() {
    this.directionsResult = this.directionsRenderer.getDirections();
    if (this.directionsResult) {
      this.directions = true;
      this.route['controls'].location['controls'].distance.patchValue(this.directionsResult.routes[0].legs[0].distance);
      this.route['controls'].location['controls'].duration.patchValue(this.directionsResult.routes[0].legs[0].duration);
      this.route['controls'].location['controls'].start_address.setValue(this.directionsResult.routes[0].legs[0].start_address);
      this.route['controls'].location['controls'].end_address.setValue(this.directionsResult.routes[0].legs[0].end_address);
    } else {
    
      this.directions = false;
    }
    this.ref.detectChanges();
  }

  showDirection() {
    this.directionsRendererDirective['showDirections'](this.direction);
  }

  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }

  onChangeFactory(event: any) {
    if (event) {
      console.log("PASSOU EVIRYBODY")
      this.direction.origin = new google.maps.LatLng(event.lat, event.lng);
      this.showDirection();
    }
  }

  onChangePacking(event: any) {
    console.log("Change Packings")
    if (typeof event != 'string') {
      this.choice_equipament = true;
      this.route['controls'].plant_supplier.setValue(event.plant);

      this.direction.destination = new google.maps.LatLng(event.plant.lat, event.plant.lng);
      this.loadPlants(event);
      this.showDirection();
    } else {
      this.choice_equipament = false;
    }
  }

  loadPackings(event): void {
    console.log("Load Packings")
    this.route['controls'].packing_code.setValue(undefined);
    this.route['controls'].plant_factory.setValue(undefined);
    this.route['controls'].plant_supplier.setValue(undefined);

    this.directions = false;

    if (typeof event != 'string') {
      this.choice_equipament = false;

      this.PackingService.retrieveAllNoBinded(event._id).subscribe(result => {

        if (result.data.length === 0) {
          this.choiced = false;
          this.existPacking = false;
          this.packings = [];
        }
        else {
          this.choiced = true;
          this.existPacking = true;
          this.packings = result.data;
        }
      });
    } else {
      this.choiced = false;
    }

  }

  onClear(){
    this.choiced = false;
  }

  loadPlants(event): void {
    this.PlantsService.retrieveAllNoBinded(event.id,this.route['controls'].supplier.value._id,event.project._id).subscribe(result => this.plants = result);
  }

  loadSuppliers(): void {
    this.suppliersService.retrieveAll().subscribe(result => {this.suppliers = result;}, err => { console.log(err) });
  }

  ngOnInit() {
    this.directionsRendererDirective['initialized$'].subscribe(directionsRenderer => {
      this.directionsRenderer = directionsRenderer;
      console.log(this.directionsRenderer)
    });

    this.route = this.fb.group({
      supplier: [undefined, [Validators.required]],
      project: [''],
      plant_factory: ['', [Validators.required]],
      plant_supplier: ['', [Validators.required]],
      packing_code: ['', [Validators.required]],
      hashPacking: ['', [Validators.required]],
      time: this.fb.group({
        max: ['', [Validators.required]],
        min: ['', [Validators.required]]
      }),
      location: this.fb.group({
        distance: this.fb.group({
          text: ['', [Validators.required]],
          value: ['', [Validators.required]]
        }),
        duration: this.fb.group({
          text: ['', [Validators.required]],
          value: ['', [Validators.required]]
        }),
        start_address: ['', [Validators.required]],
        end_address: ['', [Validators.required]]
      })
    });

   
    this.loadSuppliers();
  }

}

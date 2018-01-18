import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { PackingService } from '../../../../../servicos/packings.service';;
import { Packing } from '../../../../../shared/models/packing';
import { SuppliersService } from '../../../../../servicos/suppliers.service';
import { Supplier } from '../../../../../shared/models/supplier';
import { PlantsService } from '../../../../../servicos/plants.service';
import { RoutesService } from '../../../../../servicos/routes.service';;
import { Route } from '../../../../../shared/models/route';
import { Router,ActivatedRoute } from '@angular/router';
import { DirectionsRenderer } from '@ngui/map';
import { ToastService } from '../../../../../servicos/toast.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Rx';
declare var $:any;

@Component({
  selector: 'app-rotas-editar',
  templateUrl: './rotas-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class RotasEditarComponent implements OnInit {
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
  public inscricao: Subscription;
  public autocomplete: any;
  public address: any = {};
  public center: any;
  public pos: any;
  public directions = false;
  public plant_factory: any = "";
  public route: FormGroup;
  public suppliers =  [];
  public plants = [];
  public packings = [];


  constructor(
    private PlantsService: PlantsService,
    private PackingService: PackingService,
    private suppliersService: SuppliersService,
    private RoutesService: RoutesService,
    private router: Router,
    private routeActive: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {

    this.route = this.fb.group({
      supplier:['', [Validators.required]],
      project:[''],
      plant_factory: ['', [Validators.required]],
      plant_supplier: ['', [Validators.required]],
      packing_code: ['', [Validators.required]],
      hashPacking: ['', [Validators.required]],
      _id: ['', [Validators.required]],
      __v: ['', [Validators.required]],
      time: this.fb.group({
        max:  ['', [Validators.required]],
        min:  ['', [Validators.required]]
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
        end_address: ['', [Validators.required]],

      })
    });



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

      this.RoutesService
        .updateRoute(value._id,value)
        .subscribe(result => {
          this.toastService.edit('/rc/cadastros/rotas', 'Rota')
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


  ngOnInit() {


    this.inscricao = this.routeActive.params.subscribe(
      (params: any)=>{
        let id = params ['id'];
        this.RoutesService.retrieveRoute(id).subscribe(result => {

          let time = parseInt((result.data.time.min).toString());
          this.time_min = {
            hour: (parseInt((time / (1000 * 60 * 60 * 24)).toString())),
            minute: (parseInt((time / (1000 * 60 * 60)).toString()) % 24),
            second: (parseInt((time / (1000 * 60)).toString()) % 60)
          };


           time = parseInt((result.data.time.max).toString());
           this.time_max = {
             hour: (parseInt((time / (1000 * 60 * 60 * 24)).toString())),
             minute: (parseInt((time / (1000 * 60 * 60)).toString()) % 24),
             second: (parseInt((time / (1000 * 60)).toString()) % 60)
           };

           delete result.data.time;
          (<FormGroup>this.route)
                  .patchValue(result.data, { onlySelf: true });


            this.direction.origin = new google.maps.LatLng(result.data.plant_factory.lat, result.data.plant_factory.lng);
            this.direction.destination = new google.maps.LatLng(result.data.plant_supplier.lat, result.data.plant_supplier.lng);
            this.directionsRendererDirective['initialized$'].subscribe(directionsRenderer => {
              this.directionsRenderer = directionsRenderer;
            });
        });
      }
    )

  }

}

import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { Packing } from '../../../../shared/models/packing';
import { Supplier } from '../../../../shared/models/supplier';
import { Route } from '../../../../shared/models/route';
import { Router, ActivatedRoute } from '@angular/router';
import { DirectionsRenderer } from '@ngui/map';
import { ToastService, RoutesService, PlantsService, SuppliersService, PackingService } from '../../../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Rx';
declare var $: any;

@Component({
  selector: 'app-rotas-editar',
  templateUrl: './rotas-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class RotasEditarComponent implements OnInit {
  @ViewChild(DirectionsRenderer) directionsRendererDirective: DirectionsRenderer;
  public time_min: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  public time_max: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  public time_delay: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };

  public directionsRenderer: google.maps.DirectionsRenderer;
  public directionsResult: google.maps.DirectionsResult;
  public direction: any = {
    origin: new google.maps.LatLng(0, 0),
    destination: new google.maps.LatLng(0, 0),
    travelMode: 'DRIVING'
  };
  public inscricao: Subscription;
  public autocomplete: any;
  public address: any = {};
  public center: any = new google.maps.LatLng(0, 0);
  public pos: any;
  public directions = false;
  public plant_factory: any = "";
  public route: FormGroup;
  public suppliers = [];
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
    private fb: FormBuilder,
  ) {

    this.route = this.fb.group({
      supplier: ['', [Validators.required]],
      project: [''],
      plant_factory: ['', [Validators.required]],
      plant_supplier: ['', [Validators.required]],
      packing_code: ['', [Validators.required]],
      hashPacking: ['', [Validators.required]],
      _id: ['', [Validators.required]],
      __v: ['', [Validators.required]],
      time: this.fb.group({
        max: ['', [Validators.required]],
        min: ['', [Validators.required]],
        delay: ['', [Validators.required]]
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

    console.log('[constructor] center: ' + JSON.stringify(this.center));

    this.retrieveRoute();

  }


  onSubmit({ value, valid }: { value: any, valid: boolean }): void {
    //fazer a tranformação para segundo, somar e dar o resultado.
    let partial_min = this.time_min.hour * 1000 * 60 * 60 * 24;
    partial_min = partial_min + this.time_min.minute * 1000 * 60 * 60;
    partial_min = partial_min + this.time_min.second * 1000 * 60;

    let partial_max = this.time_max.hour * 1000 * 60 * 60 * 24;
    partial_max = partial_max + this.time_max.minute * 1000 * 60 * 60;
    partial_max = partial_max + this.time_max.second * 1000 * 60;

    let partial_delay = this.time_delay.hour * 1000 * 60 * 60 * 24;
    partial_delay = partial_delay + this.time_delay.minute * 1000 * 60 * 60;
    partial_delay = partial_delay + this.time_delay.second * 1000 * 60;

    this.route['controls'].hashPacking.setValue(this.route['controls'].supplier.value._id + this.route['controls'].packing_code.value.id);
    value.hashPacking = this.route['controls'].supplier.value._id + this.route['controls'].packing_code.value.id;
    value.time.max = partial_max;
    value.time.min = partial_min;
    value.time.to_be_late = partial_delay;

    if (this.route.valid) {

      this.RoutesService
        .updateRoute(value._id, value)
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

      console.log('[directionsChanged] this.directionsResult: ' + JSON.stringify(this.directionsResult));
      console.log('[directionsChanged] this.direction: ' + JSON.stringify(this.direction));

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

    //this.retrieveRoute();

  }

  retrieveRoute() {
    this.inscricao = this.routeActive.params.subscribe(
      (params: any) => {
        let id = params['id'];
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


          time = result.data.time.to_be_late || '0';
          time = parseInt(time.toString());
          this.time_delay = {
            hour: (parseInt((time / (1000 * 60 * 60 * 24)).toString())),
            minute: (parseInt((time / (1000 * 60 * 60)).toString()) % 24),
            second: (parseInt((time / (1000 * 60)).toString()) % 60)
          };

          delete result.data.time;
          (<FormGroup>this.route)
            .patchValue(result.data, { onlySelf: true });

          this.direction.origin = new google.maps.LatLng(result.data.plant_factory.lat, result.data.plant_factory.lng);
          this.direction.destination = new google.maps.LatLng(result.data.plant_supplier.lat, result.data.plant_supplier.lng);

          this.center = this.direction.origin;

          this.directionsRendererDirective['initialized$'].subscribe(directionsRenderer => {
            this.directionsRenderer = directionsRenderer;
          });

          console.log('[retrieveRoute] this.center: ' + JSON.stringify(this.center));
          console.log('[retrieveRoute] result: ' + JSON.stringify(result));
          console.log('[retrieveRoute] this.direction: ' + JSON.stringify(this.direction));
        });
      }
    );
  }

}

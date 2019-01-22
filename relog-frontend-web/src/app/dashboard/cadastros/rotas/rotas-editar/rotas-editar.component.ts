import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DirectionsRenderer } from '@ngui/map';
import { ToastService, RoutesService, FamiliesService, ControlPointsService } from '../../../../servicos/index.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { calculateViewDimensions } from '@swimlane/ngx-charts';

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
    origin: '',
    destination: '',
    travelMode: 'DRIVING'
  };

  public inscricao: Subscription;
  public mId: string;
  public mActualRoute: any;

  public mRoute: FormGroup;
  public autocomplete: any;
  public address: any = {};
  public center: any;
  public pos: any;
  public existPacking = true;
  public directions = false;
  public choiced = false;
  public choice_equipament = false;

  //selects
  public allFamilies: any[] = [];
  public allControlPoints: any[] = [];

  //control points
  public firstControlPoint: any;
  public secondControlPoint: any;

  constructor(
    private routesService: RoutesService,
    private familyService: FamiliesService,
    private controlPointsService: ControlPointsService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private toastService: ToastService,
    private fb: FormBuilder) {

  }


  ngOnInit() {

    this.resolveDirections();
    this.resolveFormGroup();
    this.loadFamilies();
    this.loadControlPoints();
    this.retrieveRoute();
  }

  /**
   * initialize the directions
   */
  resolveDirections() {
    this.directionsRendererDirective['initialized$'].subscribe(directionsRenderer => {
      this.directionsRenderer = directionsRenderer;
    });
  }

  /**
   * instantiate the form group
   */
  resolveFormGroup() {
    this.mRoute = this.fb.group({
      family: [undefined, [Validators.required]],
      first_point: [undefined, [Validators.required]],
      second_point: [undefined, [Validators.required]],
      distance: ['', [Validators.required]],
      duration_time: ['', [Validators.required]],
      traveling_time: this.fb.group({
        max: ['', [Validators.required]],
        min: ['', [Validators.required]],
        overtime: ['', [Validators.required]]
      })
    });
  }

  /**
   * Loads all families in the select
   */
  loadFamilies() {
    this.familyService.getAllFamilies().subscribe(result => {
      this.allFamilies = result;
    }, err => console.error(err));
  }

  /**
   * Loads all control points in the selects
   */
  loadControlPoints() {
    this.controlPointsService
      .getAllControlPoint()
      .subscribe(result => {
        this.allControlPoints = result;
      }, err => { console.log(err) });
  }

  /**
   * Retrieve the actual route
   */
  retrieveRoute() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.routesService.getRoute(this.mId).subscribe(result => {

        this.retrieveFirstControlPoint(result.first_point._id);
        this.retrieveSecondControlPoint(result.second_point._id);

        this.mActualRoute = result;
        (<FormGroup>this.mRoute).patchValue(result, { onlySelf: true });

        // console.log('recuperado');
        // console.log(result);
        // console.log(this.mRoute);
  
        this.calculateTime(result);
        //console.log(this.controlPointType);

        //center map
        // this.center = new google.maps.LatLng(this.mRoute.controls.lat.value, this.mRoute.controls.lng.value);
        // this.pos = new google.maps.LatLng(this.mRoute.controls.lat.value, this.mRoute.controls.lng.value);
      });
    });
  }

  calculateTime(result: any){
    
    // console.log(result);

    let time = 0;

    time = parseInt((result.traveling_time.min).toString());
    this.time_min = {
      hour: (parseInt((time / (1000 * 60 * 60 * 24)).toString())),
      minute: (parseInt((time / (1000 * 60 * 60)).toString()) % 24),
      second: (parseInt((time / (1000 * 60)).toString()) % 60)
    };


    time = parseInt((result.traveling_time.max).toString()); 
    this.time_max = {
      hour: (parseInt((time / (1000 * 60 * 60 * 24)).toString())),
      minute: (parseInt((time / (1000 * 60 * 60)).toString()) % 24),
      second: (parseInt((time / (1000 * 60)).toString()) % 60)
    };


    time = result.traveling_time.overtime || '0';
    time = parseInt(time.toString());
    this.time_delay = {
      hour: (parseInt((time / (1000 * 60 * 60 * 24)).toString())),
      minute: (parseInt((time / (1000 * 60 * 60)).toString()) % 24),
      second: (parseInt((time / (1000 * 60)).toString()) % 60)
    };
  }

  /**
   * Retrieve the first control point
   * @param controlId 
   */
  retrieveFirstControlPoint(controlId){

    this.controlPointsService.getControlPoint(controlId)
      .subscribe(result => {

        // console.log('retrieveFirstControlPoint');
        // console.log(result);
        // console.log(this.mRoute);

        this.firstControlPoint = result;
        this.mRoute.controls.first_point.setValue(this.firstControlPoint);
        this.firstPointChange(result);
        this.showDirection();

      }, err => this.toastService.error(err));
  }

  /**
   * Retrieve the second control point
   * @param controlId 
   */
  retrieveSecondControlPoint(controlId) {
    
    this.controlPointsService.getControlPoint(controlId)
      .subscribe(result => {

        // console.log('retrieveSecondControlPoint');
        // console.log(result);
        // console.log(this.mRoute);

        this.secondControlPoint = result;
        this.mRoute.controls.second_point.setValue(this.secondControlPoint);
        this.secondPointChange(result);
        this.showDirection();

      }, err => this.toastService.error(err));
  }


  /**
   * Select changes
   * @param param0 
   */
  firstPointChange(event: any) {
    // console.log(event);
    this.direction.origin = event.full_address;
    //this.direction.origin = new google.maps.LatLng(event.lat, event.lng);
  }

  secondPointChange(event: any) {
    // console.log(event);
    this.direction.destination = event.full_address;
    //this.direction.destination = new google.maps.LatLng(event.lat, event.lng);
  }

  /**
   * Submit button
   * @param  
   */
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

    // console.log('submit mRoute');
    // console.log(this.mRoute);

    //Ajustando objeto
    value.family = value.family._id;
    value.first_point = value.first_point._id;
    value.second_point = value.second_point._id;

    value.traveling_time.max = partial_max;
    value.traveling_time.min = partial_min;
    value.traveling_time.overtime = partial_delay;

    // console.log('value');
    // console.log(value);

    // console.log(this.mRoute);

    if (this.mRoute.valid) {

      this.proceedToRegister(value);

    } else {
      // console.log('mRoute not valid');
    }
  }

  proceedToRegister(value: any) {
    this.routesService.editRoute(this.mId, value)
      .subscribe(result => {
        this.toastService.edit('/rc/cadastros/rotas', 'Rota');
      }, err => this.toastService.error(err));
  }

  /**
   * ==================================================================
   * Direction methods
   */

  directionsChanged() {

    // console.log('directionsChanged');
    // console.log(this.mRoute);

    // value.distance = this.directionsResult.routes[0].legs[0].distance.value;
    // value.duration_time = this.directionsResult.routes[0].legs[0].duration.value;

    this.directionsResult = this.directionsRenderer.getDirections();

    this.mRoute.controls.distance.setValue(this.directionsResult.routes[0].legs[0].distance.value);
    this.mRoute.controls.duration_time.setValue(this.directionsResult.routes[0].legs[0].duration.value);

    if (this.directionsResult)
      this.directions = true;
    else
      this.directions = false;

    this.ref.detectChanges();
  }

  showDirection() {
    this.directionsRendererDirective['showDirections'](this.direction);
  }

  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }

  onChangeFactory(event: any) {

    // console.log('directionsChanged');
    // console.log(this.mRoute);

    if (event) {
      this.direction.origin = new google.maps.LatLng(event.lat, event.lng);
      this.showDirection();
    }
  }

}

import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';  
import { Router } from '@angular/router';
import { DirectionsRenderer } from '@ngui/map';
import { ToastService, RoutesService } from '../../../../servicos/index.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;
@Component({
  selector: 'app-rotas-cadastrar',
  templateUrl: './rotas-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class RotasCadastrarComponent implements OnInit {
  
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

  public mRoute: FormGroup;
  public autocomplete: any;
  public address: any = {};
  public center: any;
  public pos: any;
  public existPacking = true;
  public directions = false;
  public choiced = false;
  public choice_equipament = false;

  constructor(
    private RoutesService: RoutesService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private toastService: ToastService,
    private fb: FormBuilder) {

    }


  ngOnInit() {

    // Resolve directions
    this.directionsRendererDirective['initialized$'].subscribe(directionsRenderer => {
      this.directionsRenderer = directionsRenderer;
    });

    //Resolve Form group
    this.mRoute = this.fb.group({
      family: ['', [Validators.required]],
      first_point: ['', [Validators.required]],
      second_point: ['', [Validators.required]],
      distance: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      traveling_time: this.fb.group({
        max: ['', [Validators.required]],
        min: ['', [Validators.required]],
      })
    });
  }

  loadFamilies(){

  }

  loadPoint1() {

  }

  loadPoint2() {

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
    partial_delay = partial_max + this.time_delay.minute * 1000 * 60 * 60;
    partial_delay = partial_max + this.time_delay.second * 1000 * 60;

    //console.log('partial_delay: ' + partial_delay);

    this.mRoute['controls'].hashPacking.setValue(this.mRoute['controls'].supplier.value._id + this.mRoute['controls'].packing_code.value.id);
    value.hashPacking = this.mRoute['controls'].supplier.value._id + this.mRoute['controls'].packing_code.value.id;
    value.time.max = partial_max;
    value.time.min = partial_min;
    value.time.to_be_late = partial_delay;

    if (this.mRoute.valid) {
      value.project = value.packing_code.project._id;
      value.packing_code = value.packing_code.id;

      //console.log('value: ' + JSON.stringify(value));

      this.RoutesService.createRoute(value)
        .subscribe(result => {
          this.toastService.success('/rc/cadastros/rotas', 'Rota');
        }, err => this.toastService.error(err));

    } else {
      console.log('mRoute not valid');
    }
  }


  /**
   * ==================================================================
   * Direction methods
   */

  directionsChanged() {
    this.directionsResult = this.directionsRenderer.getDirections();
    if (this.directionsResult) {
      this.directions = true;
      this.mRoute['controls'].location['controls'].distance.patchValue(this.directionsResult.routes[0].legs[0].distance);
      this.mRoute['controls'].location['controls'].duration.patchValue(this.directionsResult.routes[0].legs[0].duration);
      this.mRoute['controls'].location['controls'].start_address.setValue(this.directionsResult.routes[0].legs[0].start_address);
      this.mRoute['controls'].location['controls'].end_address.setValue(this.directionsResult.routes[0].legs[0].end_address);

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
      this.direction.origin = new google.maps.LatLng(event.lat, event.lng);
      this.showDirection();
    }
  }

}

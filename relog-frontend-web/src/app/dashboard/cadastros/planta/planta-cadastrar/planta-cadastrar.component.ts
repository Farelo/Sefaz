import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Plant } from '../../../../shared/models/plant';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GeocodingService, ToastService, PlantsService } from '../../../../servicos/index.service';

@Component({
  selector: 'app-planta-cadastrar',
  templateUrl: './planta-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PlantaCadastrarComponent implements OnInit {

  public plant: FormGroup;
  public autocomplete: any;
  public address: any = {};
  public center: any;
  public zoom = 14;
  public default = {
    lat: 0,
    lng: 0
  }
  public pos: any;
  public geocoder = new google.maps.Geocoder;

  constructor(
    private PlantsService: PlantsService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private toastService: ToastService,
    private fb: FormBuilder,
    private geocodingService: GeocodingService
  ) {
    this.plant = this.fb.group({
      plant_name: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      location: ['', [Validators.required]]
    });
  }

  onSubmit({ value, valid }: { value: Plant, valid: boolean }): void {


    if(valid){

      this.PlantsService
        .createPlant(value)
        .subscribe(result => {
          this.toastService.success('/rc/cadastros/planta', 'Planta');
        }, err => this.toastService.error(err));
    }

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
    
    if (map.center){
      this.geocodingService.geocode(origin).subscribe(results => this.plant.controls.location.setValue(results[1].formatted_address), err => console.log(err))
    }
    
    this.plant.controls.lat.setValue(map.center ? map.center.lat() : this.default.lat);
    this.plant.controls.lng.setValue(map.center ? map.center.lng() : this.default.lng);
  }

  onClick(event) {
    if (event instanceof MouseEvent) {
      return;
    }

    this.pos = event.latLng;
    this.geocodingService.geocode(event.latLng).subscribe(results => this.plant.controls.location.setValue(results[1].formatted_address));
    this.plant.controls.lat.setValue(event.latLng.lat());
    this.plant.controls.lng.setValue(event.latLng.lng());
    event.target.panTo(event.latLng);
  }


  ngOnInit() {

  }

}

import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Plant } from '../../../../shared/models/plant';
import { PlantsService } from '../../../../servicos/plants.service';;
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastService } from '../../../../servicos/toast.service';

@Component({
  selector: 'app-planta-editar',
  templateUrl: './planta-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PlantaEditarComponent implements OnInit {
  public inscricao: Subscription;
  constructor(
    private PlantsService: PlantsService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  plant: Plant = new Plant();
  autocomplete: any;
  address: any = {};
  center: any;
  pos : any;

  registerPlant():void {
    this.PlantsService.updatePlant(this.plant._id,this.plant).subscribe( result => this.toastService.edit('/rc/cadastros/planta', 'Planta'), err => this.toastService.error(err) );
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
    this.ref.detectChanges();
  }

  onClick(event, str) {
      if (event instanceof MouseEvent){
        return;
      }

     this.pos = event.latLng;

     this.plant.lat = event.latLng.lat();
     this.plant.lng = event.latLng.lng();
     event.target.panTo(event.latLng);
    }


    ngOnInit() {

      this.inscricao = this.route.params.subscribe(
        (params: any)=>{
          let id = params ['id'];
          this.PlantsService.retrievePlant(id).subscribe(result => {
            this.plant = result.data;
            this.center = { lat: this.plant.lat, lng: this.plant.lng };
            this.pos = [this.plant.lat, this.plant.lng];
          });
        }
      )
    }

    ngOnDestroy () {
      this.inscricao.unsubscribe();
    }

}

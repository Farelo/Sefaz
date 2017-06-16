import { Component, OnInit } from '@angular/core';
import { PlantsService } from '../../servicos/plants.service';;
import { Plant } from '../../shared/models/Plant';

@Component({
  selector: 'app-planta',
  templateUrl: './planta.component.html',
  styleUrls: ['./planta.component.css']
})
export class PlantaComponent implements OnInit {

  constructor(private PlantsService : PlantsService) {  }

  plants : Plant [];

  loadPlants(){
    this.PlantsService.getPlantsPagination(10,1)
    .subscribe( plants => this.plants = plants, err => {console.log(err)});
  }

  removePlant(id):void{
    this.PlantsService.deletePlant(id).subscribe(result =>   this.loadPlants(), err => {console.log(err)})
  }

  ngOnInit() {
    this.loadPlants();
  }

}

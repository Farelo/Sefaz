import { Component, OnInit } from '@angular/core';
import { PlantsService } from '../../../servicos/plants.service';;
import { Plant } from '../../../shared/models/Plant';

@Component({
  selector: 'app-planta',
  templateUrl: './planta.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class PlantaComponent implements OnInit {

  constructor(private PlantsService : PlantsService) {  }

  plants : Plant [];
    vazio: boolean = false;

  loadPlants(){
    this.PlantsService.getPlantsPagination(10,1)
    .subscribe( plants => this.plants = plants, err => {console.log(err)});
  }

  ngOnInit() {
    this.loadPlants();
  }

}

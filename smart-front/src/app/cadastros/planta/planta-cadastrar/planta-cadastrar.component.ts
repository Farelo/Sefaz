import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plant } from '../../../shared/models/plant';
import { PlantsService } from '../../../servicos/plants.service';;

@Component({
  selector: 'app-planta-cadastrar',
  templateUrl: './planta-cadastrar.component.html',
  styleUrls: ['./planta-cadastrar.component.css']
})
export class PlantaCadastrarComponent implements OnInit {

  constructor(
    private PlantsService: PlantsService,
    private router: Router
  ) { }

  plant: Plant = new Plant();

  registerPlant():void {

    this.PlantsService.createPlant(this.plant).subscribe( result => this.router.navigate(['/cadastros/planta']) );
  }


  ngOnInit() {

  }

}

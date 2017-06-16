import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../../servicos/departments.service';
import { Department } from '../../../../shared/models/department';
import { PlantsService } from '../../../../servicos/plants.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setor-cadastrar',
  templateUrl: './setor-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class SetorCadastrarComponent implements OnInit {

  constructor(
    private PlantsService: PlantsService,
    private DepartmentService: DepartmentService,
    private router: Router
  ) { }

  plants =  [];
  department:  Department = new Department({plant:""});

  registerDepartment():void {
    console.log("aquhu");
    this.DepartmentService.createDepartment(this.department).subscribe( result => this.router.navigate(['/cadastros/setor']) );
  }

  loadPlants():void {
    this.PlantsService.retrieveAll().subscribe( result => this.plants = result );
  }

  ngOnInit() {
    this.loadPlants();
    console.log(this.department);

  }

}

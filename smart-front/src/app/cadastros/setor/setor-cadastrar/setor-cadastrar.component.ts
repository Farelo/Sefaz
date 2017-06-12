import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../servicos/departments.service';
import { Department } from '../../../shared/models/department';
import { PlantsService } from '../../../servicos/plants.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setor-cadastrar',
  templateUrl: './setor-cadastrar.component.html',
  styleUrls: ['./setor-cadastrar.component.css']
})
export class SetorCadastrarComponent implements OnInit {

  constructor(
    private PlantsService: PlantsService,
    private DepartmentService: DepartmentService,
    private router: Router
  ) { }

  plants =  [];
  department:  Department = new Department();

  registerSupplier():void {

    this.DepartmentService.createDepartment(this.department).subscribe( result => this.router.navigate(['/cadastros/setor']) );
  }

  loadPlants():void {
    this.PlantsService.retrieveAll().subscribe( result => this.plants = result );
  }

  ngOnInit() {
    console.log(this.department);

  }

}

import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../servicos/departments.service';;
import { Department } from '../../shared/models/department';

@Component({
  selector: 'app-setor',
  templateUrl: './setor.component.html',
  styleUrls: ['./setor.component.css']
})
export class SetorComponent implements OnInit {

  constructor(private DepartmentService : DepartmentService) { }
  departments : Department [];


  loadDepartments(){
    this.DepartmentService.getDepartmentsPagination(10,1)
      .subscribe(departments => this.departments = departments, err => {console.log(err)});
  }
  ngOnInit() {

    this.loadDepartments();
  }

}

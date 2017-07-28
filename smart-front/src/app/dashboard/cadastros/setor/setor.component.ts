import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../servicos/departments.service';
import { Department } from '../../../shared/models/department';
import { Pagination } from '../../../shared/models/pagination';

@Component({
  selector: 'app-setor',
  templateUrl: './setor.component.html',
    styleUrls: ['../cadastros.component.css']
})
export class SetorComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search : string;
  constructor(private DepartmentService : DepartmentService) { }

  searchEvent(): void{
    if(this.search != "" && this.search){
      // this.PackingService.getPackingsPaginationByAttr(10,this.data.meta.page,this.search)
      //   .subscribe(result => this.data = result, err => {console.log(err)});
    }else{
      this.loadDepartments();
    }
  }

  loadDepartments(){
    this.DepartmentService.getDepartmentsPagination(10,1)
      .subscribe(data => this.data = data, err => {console.log(err)});
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadDepartments();
  }

  removeDepartment(id):void{
    this.DepartmentService.deleteDepartment(id).subscribe(result =>   this.loadDepartments(), err => {console.log(err)})
  }

  ngOnInit() {

    this.loadDepartments();
  }

}

import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../servicos/departments.service';
import { Department } from '../../../shared/models/department';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-setor',
  templateUrl: './setor.component.html',
    styleUrls: ['../cadastros.component.css']
})
export class SetorComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search = "";
  constructor(
    private DepartmentService : DepartmentService,
    private modalService: NgbModal
  ) { }

  searchEvent(): void{
      this.loadDepartments();
  }

  loadDepartments(){

    this.DepartmentService
      .getDepartmentsPagination(10, this.data.meta.page,this.search)
      .subscribe(data => {
        this.data = data;
      }, err => {console.log(err)});
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadDepartments();
  }

  removeDepartment(department):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = department;
    modalRef.componentInstance.type = "department";
    modalRef.result.then((result) => {
      if(result === "remove") this.loadDepartments();
    });

  }

  ngOnInit() {

    this.loadDepartments();
  }

}

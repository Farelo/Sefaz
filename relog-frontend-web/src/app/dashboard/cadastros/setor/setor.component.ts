import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../servicos/index.service'; 
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-setor',
  templateUrl: './setor.component.html',
    styleUrls: ['../cadastros.component.css']
})
export class SetorComponent implements OnInit {
  
  public allDepartments: any[] = [];
  public auxAllDepartments: any[] = [];
  public search = "";
  public actualPage = -1;

  constructor(
    private departmentService : DepartmentService,
    private modalService: NgbModal) { }


  ngOnInit() {

    this.loadDepartments();
  }

  loadDepartments(){

    this.departmentService.getAllDepartment().subscribe(data => {
      this.allDepartments = data;
      this.auxAllDepartments = data;
    }, err => {console.log(err)});
  }

  searchEvent(event): void {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.auxAllDepartments.filter(function (item) {
      return ((item.name.toLowerCase().indexOf(val) !== -1 || !val)
        || (item.control_point.name.toLowerCase().indexOf(val) !== -1 || !val));
    });

    // update the rows
    this.allDepartments = temp;
    // Whenever the filter changes, always go back to the first page
    this.actualPage = 0;
  }

  removeDepartment(project): void {
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = project;
    modalRef.componentInstance.mType = "DEPARTMENT";

    modalRef.result.then((result) => {
      this.loadDepartments();
    });
  }

}

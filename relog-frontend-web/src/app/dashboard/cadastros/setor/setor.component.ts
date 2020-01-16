import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../servicos/index.service';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(public translate: TranslateService,
    private departmentService: DepartmentService,
    private modalService: NgbModal) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

  ngOnInit() {

    this.loadDepartments();
  }

  loadDepartments() {

    this.departmentService.getAllDepartment().subscribe(data => {
      this.allDepartments = data;
      this.auxAllDepartments = data;
    }, err => { console.log(err) });
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

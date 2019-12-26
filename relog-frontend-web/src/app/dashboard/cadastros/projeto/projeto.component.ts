import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../servicos/index.service';
import { Project } from '../../../shared/models/project';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-projeto',
  templateUrl: './projeto.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class ProjetoComponent implements OnInit {

  public allProjects: any[] = [];
  public actualPage = -1;
  public search = "";
  public auxAllProjects: any[] = [];

  constructor(
    public translate: TranslateService,
    private projectService: ProjectService,
    private modalService: NgbModal) { }

  ngOnInit() {

    this.loadProjects();
  }

  loadProjects() {
    this.projectService
      .getAllProjects()
      .subscribe(data => {

        this.auxAllProjects = data;
        this.allProjects = data;
      },
        err => { console.log(err) });
  }

  pageChanged(page: any): void {

    this.loadProjects();
  }

  removeProject(project): void {
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = project;
    modalRef.componentInstance.mType = "PROJECT";

    modalRef.result.then((result) => {
      this.loadProjects();
    });
  }

  searchEvent(event): void {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.auxAllProjects.filter(function (item) {
      return item.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.allProjects = temp;
    // Whenever the filter changes, always go back to the first page
    this.actualPage = 0;
  }
}

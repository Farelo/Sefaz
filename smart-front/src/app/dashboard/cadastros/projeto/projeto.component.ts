import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../servicos/index.service';
import { Project } from '../../../shared/models/project';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-projeto',
  templateUrl: './projeto.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class ProjetoComponent implements OnInit {

  public allProjects: any[] = [];
  public actualPage = -1;
  public search = "";

  constructor(
    private projectService: ProjectService,
    private modalService: NgbModal) { }

  ngOnInit() {

    this.loadProjects();
  }

  searchEvent(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService
      .getAllProjects()
      .subscribe(data => {
        this.allProjects = data;
      },
        err => { console.log(err) });
  }

  pageChanged(page: any): void {

    this.loadProjects();
  }

  removeProject(project): void {
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = project;
    modalRef.componentInstance.type = "project";

    modalRef.result.then((result) => {
      this.loadProjects();
    });
  }

}

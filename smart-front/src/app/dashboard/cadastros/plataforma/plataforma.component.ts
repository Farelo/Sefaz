import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../servicos/projects.service';
import { Project } from '../../../shared/models/project';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-plataforma',
  templateUrl: './plataforma.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class PlataformaComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search : string;
  constructor(
    private ProjectService : ProjectService,
    private modalService: NgbModal
  ) { }

    searchEvent(): void{
      if(this.search != "" && this.search){
        // this.PackingService.getPackingsPaginationByAttr(10,this.data.meta.page,this.search)
        //   .subscribe(result => this.data = result, err => {console.log(err)});
      }else{
        this.loadProjects();
      }
    }

    loadProjects(){
      this.ProjectService.getProjectPagination(10,this.data.meta.page)
        .subscribe(data => this.data = data,
         err => {console.log(err)});
    }

    pageChanged(page: any): void{
      this.data.meta.page = page;
      this.loadProjects();
    }

    removeProject(project):void{
      const modalRef = this.modalService.open(ModalDeleteComponent);
      modalRef.componentInstance.view = project;
      modalRef.componentInstance.type = "project";

      modalRef.result.then((result) => {
        if(result === "remove") this.loadProjects();
      });
    }

    ngOnInit() {

      this.loadProjects();
    }


}

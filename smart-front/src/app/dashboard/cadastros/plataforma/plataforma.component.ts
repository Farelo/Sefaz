import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../servicos/projects.service';
import { Project } from '../../../shared/models/project';
import { Pagination } from '../../../shared/models/pagination';

@Component({
  selector: 'app-plataforma',
  templateUrl: './plataforma.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class PlataformaComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search : string;
  constructor(private ProjectService : ProjectService) { }

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

    removeProject(id):void{
      this.ProjectService.deleteProject(id).subscribe(result =>   this.loadProjects(), err => {console.log(err)})
    }

    ngOnInit() {

      this.loadProjects();
    }


}

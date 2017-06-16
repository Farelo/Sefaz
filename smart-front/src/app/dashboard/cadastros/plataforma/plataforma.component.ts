import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../servicos/projects.service';
import { Project } from '../../../shared/models/project';

@Component({
  selector: 'app-plataforma',
  templateUrl: './plataforma.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class PlataformaComponent implements OnInit {

  constructor(private ProjectService : ProjectService) { }

    vazio: boolean = true;
    projects: Project [];

    loadProjects(){
      this.ProjectService.getProjectPagination(10,1)
        .subscribe(checkpoints => this.projects = checkpoints,
         err => {console.log(err)});
    }


    removeProject(id):void{
      this.ProjectService.deleteProject(id).subscribe(result =>   this.loadProjects(), err => {console.log(err)})
    }

    ngOnInit() {
      this.loadProjects();
    }


}

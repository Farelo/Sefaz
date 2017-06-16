import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../../shared/models/project';
import { ProjectService } from '../../../../servicos/projects.service';;


@Component({
  selector: 'app-plataforma-cadastrar',
  templateUrl: './plataforma-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PlataformaCadastrarComponent implements OnInit {

  constructor(
    private ProjectService: ProjectService,
    private router: Router
  ) { }

  project: Project = new Project();


  registerProject():void {

    this.ProjectService.createProject(this.project).subscribe( result => this.router.navigate(['/rc/cadastros/plataforma']) );
  }


  ngOnInit() {
    console.log(this.project);

  }

}

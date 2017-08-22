import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../../shared/models/project';
import { ProjectService } from '../../../../servicos/projects.service';;
import { ToastService } from '../../../../servicos/toast.service';

@Component({
  selector: 'app-plataforma-cadastrar',
  templateUrl: './plataforma-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PlataformaCadastrarComponent implements OnInit {

  constructor(
    private ProjectService: ProjectService,
    private router: Router,
    private toastService: ToastService
  ) { }

  project: Project = new Project();


  registerProject():void {

    this.ProjectService.createProject(this.project).subscribe( result => this.toastService.success('/rc/cadastros/plataforma', 'Plataforma'), err =>  this.toastService.error(err));
  }


  ngOnInit() {
    console.log(this.project);

  }

}

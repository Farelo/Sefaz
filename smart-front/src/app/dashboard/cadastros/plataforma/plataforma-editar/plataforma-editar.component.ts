import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../../shared/models/project';
import { ProjectService } from '../../../../servicos/projects.service';;
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-plataforma-editar',
  templateUrl: './plataforma-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PlataformaEditarComponent implements OnInit {
  public inscricao: Subscription;
  constructor(
    private ProjectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  project: Project = new Project();


  registerProject():void {
    this.ProjectService.updateProject(this.project._id,this.project).subscribe( result => this.router.navigate(['/rc/cadastros/plataforma']) );
  }


  ngOnInit() {

    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params ['id'];
        this.ProjectService.retrieveProject(id).subscribe(result => this.project = result.data);
      }
    )
  }

  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }

}

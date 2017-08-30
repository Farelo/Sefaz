import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../../shared/models/project';
import { ProjectService } from '../../../../servicos/projects.service';;
import { ToastService } from '../../../../servicos/toast.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-plataforma-cadastrar',
  templateUrl: './plataforma-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PlataformaCadastrarComponent implements OnInit {
  public project: FormGroup;
  constructor(
    private ProjectService: ProjectService,
    private router: Router,
    private toastService: ToastService,
    private fb: FormBuilder
  ) { }


  onSubmit({ value, valid }: { value: Project, valid: boolean }): void {
      if(valid)this.ProjectService.createProject(value)
                   .subscribe( result => this.toastService.success('/rc/cadastros/plataforma', 'Plataforma'), err =>  this.toastService.error(err));
  }

  ngOnInit() {
    this.project = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

}

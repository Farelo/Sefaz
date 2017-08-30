import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../../shared/models/project';
import { ProjectService } from '../../../../servicos/projects.service';;
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastService } from '../../../../servicos/toast.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-plataforma-editar',
  templateUrl: './plataforma-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PlataformaEditarComponent implements OnInit {
  public inscricao: Subscription;
  public project: FormGroup;

  constructor(
    private ProjectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private fb: FormBuilder
  ) { }

  onSubmit({ value, valid }: { value: Project, valid: boolean }): void {
      if(valid)this.ProjectService.updateProject(value._id,value)
                  .subscribe( result => this.toastService.edit('/rc/cadastros/plataforma', 'Plataforma'), err =>  this.toastService.error(err));
  }

  ngOnInit() {
    this.project = this.fb.group({
      name: ['', [Validators.required]],
      _id: ['', [Validators.required]],
      __v: ['', [Validators.required]]
    });

    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params ['id'];
        this.ProjectService.retrieveProject(id).subscribe(result => (<FormGroup>this.project).setValue(result.data, { onlySelf: true }));
      }
    )
  }

  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../../shared/models/project';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastService, ProjectService } from '../../../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-projeto-editar',
  templateUrl: './projeto-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class ProjetoEditarComponent implements OnInit {
  public inscricao: Subscription;
  public mProject: FormGroup;
  public mId: string;
  public mActualProject: any;

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {
    
    this.createFormGroup();
    this.retrieveUser();
  }

  createFormGroup(){
    this.mProject = this.fb.group({
      name: ['', [Validators.required], this.validateNotTaken.bind(this)]
    });
  }

  onSubmit({ value, valid }: { value: Project, valid: boolean }): void {

    if (valid) {

      this.projectService
        .createProject(value)
        .subscribe(result => {
          this.toastService.success('/rc/cadastros/projeto', 'Projeto')
        }, err => this.toastService.error(err));
    }
  }
  
  retrieveUser() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.projectService.getProject(this.mId).subscribe(result => {

        // let actualValues = {
        //   code: result.code,
        //   company: result.company,
        //   control_points: result.control_points
        // };
        //console.log('this.actualValues...' + JSON.stringify(actualValues));
        this.mActualProject = result;
        (<FormGroup>this.mProject).patchValue(result, { onlySelf: true });
      });
    });
  }


  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }


  /**
   * Misc
   */
  public validateNotTakenLoading: boolean;
  validateNotTaken(control: AbstractControl) {
    this.validateNotTakenLoading = true;
    return control
      .valueChanges
      .delay(800)
      .debounceTime(800)
      .distinctUntilChanged()
      .switchMap(value => this.projectService.getAllProjects({ name: control.value }))
      .map(res => {
        this.validateNotTakenLoading = false;

        if (res.length == 0) {
          console.log('empty')
          return control.setErrors(null);
        } else {
          console.log('not empty')
          return control.setErrors({ uniqueValidation: 'code already exist' })
        }
      })
  }

}

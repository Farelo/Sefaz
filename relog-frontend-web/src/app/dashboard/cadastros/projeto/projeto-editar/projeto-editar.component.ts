import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../../shared/models/project';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastService, ProjectService } from '../../../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-projeto-editar',
  templateUrl: './projeto-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class ProjetoEditarComponent implements OnInit {

  public submitted: boolean = true;
  public inscricao: Subscription;
  public mProject: FormGroup;
  public mId: string;
  public mActualProject: any;

  constructor(public translate: TranslateService,
    private projectService: ProjectService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private fb: FormBuilder) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

  ngOnInit() {

    this.createFormGroup();
    this.retrieveUser();
  }

  createFormGroup() {
    this.mProject = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^((?!\s{2}).)*$/)]]
    });
  }

  onSubmit({ value, valid }: { value: Project, valid: boolean }): void {

    this.submitted = true;

    if (valid) {
      this.projectService
        .editProject(this.mId, value)
        .subscribe(result => {
          this.toastService.success('/rc/cadastros/projeto', this.translate.instant('MISC.TOAST.PROJECT'))
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
  validateName(event: any) {

    //console.log(this.mPacking.get('tag.code').value);

    if (!this.mProject.get('name').errors && (this.mActualProject.name !== this.mProject.get('name').value)) {

      this.validateNotTakenLoading = true;
      this.projectService.getAllProjects({ name: this.mProject.get('name').value }).subscribe(result => {

        if (result.length == 0)
          this.mProject.get('name').setErrors(null);
        else
          this.mProject.get('name').setErrors({ uniqueValidation: true });

        this.validateNotTakenLoading = false;
      });
    }
  }

  // validateNotTaken(control: AbstractControl) {
  //   this.validateNotTakenLoading = true;
  //   return control
  //     .valueChanges
  //     .delay(800)
  //     .debounceTime(800)
  //     .distinctUntilChanged()
  //     .switchMap(value => this.projectService.getAllProjects({ name: control.value }))
  //     .map(res => {
  //       this.validateNotTakenLoading = false;

  //       if (res.length == 1) {
  //         console.log('not empty')
  //         return control.setErrors({ uniqueValidation: 'code already exist' })

  //       } else {
  //         console.log('empty')
  //         return control.setErrors(null);
  //       }
  //     })
  // }

}

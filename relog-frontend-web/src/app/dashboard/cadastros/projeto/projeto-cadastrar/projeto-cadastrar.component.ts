import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../shared/models/project';
import { ToastService, ProjectService } from '../../../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-projeto-cadastrar',
  templateUrl: './projeto-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class ProjetoCadastrarComponent implements OnInit {

  public mProject: FormGroup;
  public submitted :boolean = false;

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.mProject = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^((?!\s{2}).)*$/)]]
    });
  }

  onSubmit({ value, valid }: { value: Project, valid: boolean }): void {

    this.submitted = true;

    if (valid) {
      this.projectService
        .createProject(value)
        .subscribe(result => {
          this.toastService.success('/rc/cadastros/projeto', 'Projeto')
        }, err => this.toastService.error(err));
    }
  }
  
  public validateNotTakenLoading: boolean;
  validateName(event: any) {

    //console.log(this.mPacking.get('tag.code').value);

    if (!this.mProject.get('name').errors) {

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
  //         //console.log('not empty')
  //         return control.setErrors({ uniqueValidation: 'code already exist' })

  //       } else{
  //         //console.log('empty')
  //         return control.setErrors(null);
  //       }
  //     })
  // }

}

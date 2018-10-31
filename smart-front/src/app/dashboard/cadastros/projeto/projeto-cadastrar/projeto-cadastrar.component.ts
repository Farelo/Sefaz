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

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.mProject = this.fb.group({
      name: ['', [Validators.required], this.validateNotTaken.bind(this) ]
    });
  }

  onSubmit({ value, valid }: { value: Project, valid: boolean }): void {

      if(valid){

        this.projectService
          .createProject(value)
          .subscribe( result => {
            this.toastService.success('/rc/cadastros/projeto', 'Projeto')
          }, err =>  this.toastService.error(err));
      }
  }


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

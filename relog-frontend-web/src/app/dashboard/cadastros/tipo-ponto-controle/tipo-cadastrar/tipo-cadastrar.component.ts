import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'app/servicos/toast.service'; 
import { ControlPointTypesService } from 'app/servicos/index.service';

@Component({
  selector: 'app-tipo-cadastrar',
  templateUrl: './tipo-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class TipoPontoControleCadastrarComponent implements OnInit {

  public mType: FormGroup;

  constructor(
    private controlPointTypesService: ControlPointTypesService,
    private toastService: ToastService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.mType = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^((?!\s{2}).)*$/)]]
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    if (valid) {

      this.controlPointTypesService
        .createType(value)
        .subscribe(result => {
          this.toastService.success('/rc/cadastros/tipo-ponto-controle', 'Tipo')
        }, err => this.toastService.error(err));
    }
  }

  public validateNotTakenLoading: boolean;
  validateName(event: any) {

    //console.log(this.mRack.get('tag.code').value);

    if (!this.mType.get('name').errors) {

      this.validateNotTakenLoading = true;
      this.controlPointTypesService.getAllTypes({ name: this.mType.get('name').value }).subscribe(result => {

        if (result.length == 0)
          this.mType.get('name').setErrors(null);
        else
          this.mType.get('name').setErrors({ uniqueValidation: true });

        this.validateNotTakenLoading = false;
      });
    }
  }
}

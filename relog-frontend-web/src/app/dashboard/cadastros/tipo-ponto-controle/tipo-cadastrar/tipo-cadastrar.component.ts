import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'app/servicos/toast.service'; 
import { ControlPointTypesService } from 'app/servicos/index.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tipo-cadastrar',
  templateUrl: './tipo-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class TipoPontoControleCadastrarComponent implements OnInit {

  public mType: FormGroup;

  constructor(public translate: TranslateService,
    private controlPointTypesService: ControlPointTypesService,
    private toastService: ToastService,
    private fb: FormBuilder) { 

      if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
    }

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
          this.toastService.success('/rc/cadastros/tipo-ponto-controle', this.translate.instant('MISC.TOAST.TYPE'))
        }, err => this.toastService.error(err));
    }
  }

  public validateNotTakenLoading: boolean;
  validateName(event: any) {

    //console.log(this.mPacking.get('tag.code').value);

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

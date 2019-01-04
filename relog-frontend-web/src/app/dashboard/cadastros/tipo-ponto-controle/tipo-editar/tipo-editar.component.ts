import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'app/servicos/toast.service';
import { ControlPointTypesService } from 'app/servicos/index.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tipo-editar',
  templateUrl: './tipo-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class TipoPontoControleEditarComponent implements OnInit {

  public inscricao: Subscription;
  public mType: FormGroup;
  public mId: string;
  public mActualType: any;

  constructor(
    private controlPointTypesService: ControlPointTypesService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.createFormGroup();
    this.retrieveType();
  }

  createFormGroup() {
    this.mType = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^((?!\s{2}).)*$/)]]
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    if (valid) {

      this.controlPointTypesService
        .editType(this.mId, value)
        .subscribe(result => {
          this.toastService.success('/rc/cadastros/tipo-ponto-controle', 'Tipo')
        }, err => this.toastService.error(err));
    }
  }

  retrieveType() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.controlPointTypesService.getType(this.mId).subscribe(result => {

        //console.log('this.actualValues...' + JSON.stringify(actualValues));
        this.mActualType = result;
        (<FormGroup>this.mType).patchValue(result, { onlySelf: true });
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

    if (!this.mType.get('name').errors && (this.mActualType.name !== this.mType.get('name').value)) {

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

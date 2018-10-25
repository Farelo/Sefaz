import { Component, OnInit } from '@angular/core';
import { ToastService, PackingService, CompaniesService } from '../../../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { Family } from 'app/shared/models/family';
import { FamiliesService } from 'app/servicos/families.service';

@Component({
  selector: 'app-familia-cadastro',
  templateUrl: './familia-cadastro.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class FamiliaCadastroComponent implements OnInit {
  public mFamily: FormGroup;
  public allCompanies: any[] = [];
  public allControlPoints: any[] = [];
  // [{ id: '5a15b13c2340978ec3d2c0ea', name: 'Controle Point ABC' },
  //  { id: '5a15b13c728cd3f43cc0fe8a', name: 'XTZ Control Point' }];

  public validForm: boolean = true;
  public submited = false;

  constructor(
    private companyService: CompaniesService,
    private familyService: FamiliesService,
    private packingService: PackingService,
    private toastService: ToastService,
    private fb: FormBuilder) {

  }

  ngOnInit() {
    this.configureFormGroup();
    this.fillCompanySelect();
    this.fillControlPointsSelect();
  }

  configureFormGroup() {
    this.mFamily = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^((?!\s{2}).)*$/)], this.validateNotTaken.bind(this) ],
      selectedCompanies: [undefined, [Validators.required]],
      selectedControlPoints: new FormControl([])
    });
  }

  /**
   * Fill the select of companies
   */
  fillCompanySelect() {

    this.companyService.getAllCompanies().subscribe(result => {
      this.allCompanies = result;
    }, err => console.error(err));
  }

  /**
   * Fill the select of control points
   */
  fillControlPointsSelect() {

  }

  onSubmit(): void {

    this.submited = true;

    if (this.mFamily.valid) {

      let newFamily = {
        code: this.mFamily.controls.code.value,
        company: this.mFamily.controls.selectedCompanies.value._id,
        //control_points: this.mFamily.controls.selectedControlPoints.value.map(elem => elem._id)
      }

      this.finishRegister(newFamily);
    }
  }


  finishRegister(value) {
    this.familyService.createFamily(value).subscribe(result => {
      this.toastService.success('/rc/cadastros/familia', 'Família');
    }, err => this.toastService.error(err));
  }


  public emailLoading: boolean;
  validateNotTaken(control: AbstractControl) {
    this.emailLoading = true;
    return control
      .valueChanges
      .delay(800)
      .debounceTime(800)
      .distinctUntilChanged()
      .switchMap(value => this.familyService.getAllFamilies({ code: control.value }))
      //.switchMap(value => this.packingService.getAllPackings())
      .map(res => {
        this.emailLoading = false;
        
        if (res.length == 0) {
          return control.setErrors(null);
        } else {
          return control.setErrors({ uniqueValidation: 'code already exist' })
        }
      })
  }

}

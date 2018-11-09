import { Component, OnInit } from '@angular/core';
import { ToastService, PackingService, CompaniesService, ControlPointsService } from '../../../../servicos/index.service';
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

  public validForm: boolean = true;
  public submited = false;

  constructor(
    private companyService: CompaniesService,
    private familyService: FamiliesService,
    private controlPointsService: ControlPointsService,
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
      code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern(/^((?!\s{2}).)*$/)]],
      company: [undefined, [Validators.required]],
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
    this.controlPointsService.getAllControlPoint().subscribe(result => { 
      this.allControlPoints = result; 
      }, err => { console.log(err) });
  }

  onSubmit(): void {

    this.submited = true;

    if (this.mFamily.valid) {

      let newFamily = {
        code: this.mFamily.controls.code.value,
        company: this.mFamily.controls.company.value._id,
        control_points: this.mFamily.controls.selectedControlPoints.value.map(elem => elem._id)
      }

      //console.log(newFamily);

      this.finishRegister(newFamily);
    }
  }


  finishRegister(value) {
    this.familyService.createFamily(value).subscribe(result => {
      this.toastService.success('/rc/cadastros/familia', 'Família');
    }, err => this.toastService.error(err));
  }

  validateCode(event: any){

    //console.log(this.mPacking.get('tag.code').value);

    if (this.mFamily.get('code').value) {

      this.validateNotTakenLoading = true;
      this.familyService.getAllFamilies({ code: this.mFamily.get('code').value }).subscribe(result => {

        if (result.length == 0)
          this.mFamily.get('code').setErrors(null);
        else
          this.mFamily.get('code').setErrors({ uniqueValidation: true });

        this.validateNotTakenLoading = false;
      });
    }
  }

  public validateNotTakenLoading: boolean;
  // validateNotTaken(control: AbstractControl) {
  //   this.emailLoading = true;
  //   return control
  //     .valueChanges
  //     .delay(800)
  //     .debounceTime(800)
  //     .distinctUntilChanged()
  //     .switchMap(value => this.familyService.getAllFamilies({ code: control.value }))
  //     //.switchMap(value => this.packingService.getAllPackings())
  //     .map(res => {
  //       this.emailLoading = false;
        
  //       if (res.length == 0) {
  //         return control.setErrors(null);
  //       } else {
  //         return control.setErrors({ uniqueValidation: 'code already exist' })
  //       }
  //     })
  // }

}

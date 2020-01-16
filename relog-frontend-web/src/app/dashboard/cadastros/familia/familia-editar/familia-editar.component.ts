import { Component, OnInit } from '@angular/core';
import { Packing } from '../../../../shared/models/packing';
import { Supplier } from '../../../../shared/models/supplier';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastService, ProjectService, SuppliersService, TagsService, PackingService, CompaniesService, FamiliesService, ControlPointsService } from '../../../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-familia-editar',
  templateUrl: './familia-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class FamiliaEditarComponent implements OnInit {

  public mFamily: FormGroup;
  public inscricao: Subscription;
  public allCompanies: any[] = [];
  public allControlPoints: any[] = [];
  // [{ id: '5a15b13c2340978ec3d2c0ea', name: 'Controle Point ABC' },
  //  { id: '5a15b13c728cd3f43cc0fe8a', name: 'XTZ Control Point' }];

  public validForm: boolean = true;
  public submited = false;
  public mId: string;
  public mActualFamily: any;

  constructor(public translate: TranslateService,
    private familiesService: FamiliesService,
    private companyService: CompaniesService,
    private controlPointsService: ControlPointsService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private route: ActivatedRoute) { 

      if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
    }

  ngOnInit() {

    this.configureFormGroup();
    this.fillCompanySelect();
    this.fillControlPointsSelect();
    this.retrieveUser();
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

  selectAll() {
    this.mFamily.controls.control_points.setValue(this.allControlPoints);
  }

  unselectAll() {
    this.mFamily.controls.control_points.setValue([]);
  }

  configureFormGroup() {
    this.mFamily = this.fb.group({
      code: ['',
        [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern(/^((?!\s{2}).)*$/) ]
      ],
      company: ['', [Validators.required]],
      control_points: new FormControl([])
    });
  }

  retrieveUser() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.familiesService.getFamily(this.mId).subscribe(result => {

        // let actualValues = {
        //   code: result.code,
        //   company: result.company,
        //   control_points: result.control_points
        // };
        //console.log('this.actualValues...' + JSON.stringify(actualValues));
        this.mActualFamily = result;
        (<FormGroup>this.mFamily).patchValue(result, { onlySelf: true });
      });
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {
    this.submited = true;

    if (this.mFamily.valid) {

      //console.log(this.mFamily);

      let newFamily = {
        code: this.mFamily.controls.code.value,
        company: this.mFamily.controls.company.value._id,
        control_points: this.mFamily.controls.control_points.value.map(elem => elem._id)
      }

      //console.log(newFamily);

      this.finishUpdate(newFamily);
    }
  }

  finishUpdate(newFamily: any) {
    this.familiesService.editFamily(this.mId, newFamily).subscribe(result => {
      this.toastService.success('/rc/cadastros/familia', 'Família');
    }, err => this.toastService.error(err));
  }

  validateCode(event: any) {

    //console.log(this.mPacking.get('tag.code').value);

    if (this.mActualFamily.code == this.mFamily.get('code').value) {
      this.validateNotTakenLoading = false;
      this.mFamily.get('code').setErrors(null);
      return;
    }

    if (this.mFamily.get('code').value && this.mFamily.controls.code.valid) {

      this.validateNotTakenLoading = true;
      this.familiesService.getAllFamilies({ code: this.mFamily.get('code').value }).subscribe(result => {

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
  //   this.validateNotTakenLoading = true;

  //   if (this.mActualFamily.code == control.value) {
  //     this.validateNotTakenLoading = false;
  //     return new Promise((resolve, reject) => resolve(null));
  //   }

  //   return control
  //     .valueChanges
  //     .delay(800)
  //     .debounceTime(800)
  //     .distinctUntilChanged()
  //     .switchMap(value => this.familiesService.getAllFamilies({ code: control.value }))
  //     .map(res => {
        
  //       this.validateNotTakenLoading = false;
  //       if (res.length == 0) {
  //         return control.setErrors(null);
  //       } else {
  //         return control.setErrors({ uniqueValidation: 'code already exist' })
  //       }
  //     })
  // }
}

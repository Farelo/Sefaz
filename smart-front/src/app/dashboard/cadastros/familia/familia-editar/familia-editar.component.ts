import { Component, OnInit } from '@angular/core';
import { Packing } from '../../../../shared/models/packing';
import { Supplier } from '../../../../shared/models/supplier';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastService, ProjectService, SuppliersService, TagsService, PackingService, CompaniesService, FamiliesService, ControlPointsService } from '../../../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

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

  constructor(
    private familiesService: FamiliesService,
    private companyService: CompaniesService,
    private controlPointsService: ControlPointsService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private route: ActivatedRoute) { }

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


  configureFormGroup() {
    this.mFamily = this.fb.group({
      code: ['',
        [Validators.required, Validators.pattern(/^((?!\s{2}).)*$/) ],
        this.validateNotTaken.bind(this)
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

  public validateNotTakenLoading: boolean;
  validateNotTaken(control: AbstractControl) {
    this.validateNotTakenLoading = true;

    if (this.mActualFamily.code == control.value) {
      this.validateNotTakenLoading = false;
      return new Promise((resolve, reject) => resolve(null));
    }

    return control
      .valueChanges
      .delay(800)
      .debounceTime(800)
      .distinctUntilChanged()
      .switchMap(value => this.familiesService.getAllFamilies({ code: control.value }))
      .map(res => {
        
        this.validateNotTakenLoading = false;
        if (res.length == 0) {
          return control.setErrors(null);
        } else {
          return control.setErrors({ uniqueValidation: 'code already exist' })
        }
      })
  }
}

import { Component, OnInit } from '@angular/core';
import { Packing } from '../../../../shared/models/packing';
import { Supplier } from '../../../../shared/models/supplier';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastService, ProjectService, SuppliersService, TagsService, PackingService, CompaniesService, FamiliesService } from '../../../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

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

  constructor(
    private familiesService: FamiliesService, 
    private companyService: CompaniesService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit() {
   
    this.configureFormGroup();
    this.retrieveUser();
    this.fillCompanySelect();
  }
  
  /**
  * Fill the select of companies
  */
  fillCompanySelect() {

    this.companyService.getAllCompanies().subscribe(result => {
      this.allCompanies = result;
    }, err => console.error(err));
  }

  configureFormGroup() {
    this.mFamily = this.fb.group({
      code: ['', [Validators.required]],
      company: ['', [Validators.required]],
      control_points: new FormControl([])
    });
  }

  retrieveUser(){
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.familiesService.getFamily(this.mId).subscribe(result => {
        
        // let actualValues = {
        //   code: result.code,
        //   company: result.company,
        //   control_points: result.control_points
        // };
        //console.log('this.actualValues...' + JSON.stringify(actualValues));

        (<FormGroup>this.mFamily).patchValue(result, { onlySelf: true });
      });
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {
    this.submited = true;

    if (this.mFamily.valid) {

      let newFamily = {
        code: this.mFamily.controls.code.value,
        company: this.mFamily.controls.company.value._id,
        //control_points: this.mFamily.controls.control_points.value.map(elem => elem._id)
      }

      this.finishUpdate(newFamily);
    }
  }

  finishUpdate(newFamily: any){
    this.familiesService.editFamily(this.mId, newFamily).subscribe(result => {
      this.toastService.success('/rc/cadastros/familia', 'Família');
    }, err => this.toastService.error(err));
  }

}

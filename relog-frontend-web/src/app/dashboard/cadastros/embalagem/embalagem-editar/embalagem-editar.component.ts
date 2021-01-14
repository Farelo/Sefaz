import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService, PackingService, FamiliesService, ProjectService } from '../../../../servicos/index.service';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-embalagem-editar',
  templateUrl: './embalagem-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class EmbalagemEditarComponent implements OnInit {

  public mPacking: FormGroup;
  public listOfFamilies: any[] = [];
  public listOfProjects: any[] = [];
  public inscricao: Subscription;
  public mId: string;
  public mActualPacking: any;
  public activePacking: boolean = false;
  public deviceModel: any[] = [];

  constructor(public translate: TranslateService,
    private familyService: FamiliesService,
    private packingService: PackingService,
    private projectService: ProjectService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) { 

      if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
    }

  ngOnInit() {

    this.configureForm();
    this.loadFamilies();
    this.loadProjects();
    this.fillSelectType();
    this.retrieveUser();
  }


  fillSelectType() {
    this.deviceModel = [
      { label: "Loka Mind", name: "loka" },
      { label: "ALPS", name: "alps" },
      { label: "Ayga", name: "ayga" },
    ];
  }

  loadFamilies() {
    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamilies = result;
    }, err => console.error(err));
  }

  /**
   * Load the projects in the select
   */
  loadProjects() {
    this.projectService.getAllProjects().subscribe(result => {
      this.listOfProjects = result;
    }, err => console.error(err));
  }

  retrieveUser() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.packingService.getPacking(this.mId).subscribe(result => {

        //console.log('result ...' + JSON.stringify(result));
        if (result['observations'] == null) result['observations'] = '';

        this.mActualPacking = result;
        (<FormGroup>this.mPacking).patchValue(result, { onlySelf: true });
      });
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    if (valid) {
      let newValue = { ...value }
      newValue.family = newValue.family._id;
      newValue.project = newValue.project._id;

      this.finishUpdate(newValue);
    }
  }

  finishUpdate(newValue) {
    this.packingService.editPacking(this.mId, newValue)
      .subscribe(result => {
        let message = {
          title: this.translate.instant('MISC.TOAST.PACK_UPDATED_TITLE'),
          body: this.translate.instant('MISC.TOAST.PACK_UPDATED_BODY')
        }
        this.toastService.show('/rc/cadastros/embalagem', message);
      });
  }


  configureForm() {
    this.mPacking = this.fb.group({
      tag: this.fb.group({
        code: ['',
          [Validators.required, Validators.minLength(4), Validators.pattern(/^((?!\s{2}).)*$/)]],
        version: ['', [Validators.required, Validators.pattern(/^((?!\s{2}).)*$/)]],
        manufactorer: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^((?!\s{2}).)*$/)]],
        deviceModel: [null, [Validators.required]]
      }),
      serial: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^((?!\s{2}).)*$/)]],
      type: ['', [Validators.required, Validators.pattern(/^((?!\s{2}).)*$/)]],
      weigth: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
      width: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
      heigth: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
      length: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
      capacity: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
      family: [null, [Validators.required]],
      project: [null, [Validators.required]],
      observations: ['', [Validators.maxLength(140)]],
      active: false
    });
  }

  validateTag(event: any) {

    //console.log(this.mPacking.get('tag.code').value);
    if (!this.mPacking.get('tag.code').errors && (this.mActualPacking.tag.code !== this.mPacking.get('tag.code').value)) {
      //console.log('.');

      this.validateNotTakenLoading = true;
      this.packingService.getAllPackings({ tag_code: this.mPacking.get('tag.code').value }).subscribe(result => {

        if (result.length == 0)
          this.mPacking.get('tag.code').setErrors(null);
        else
          this.mPacking.get('tag.code').setErrors({ uniqueValidation: true });

        this.validateNotTakenLoading = false;
      });
    }
  }

  public validateNotTakenLoading: boolean = false;
  // validateNotTaken(control: AbstractControl) {
  //   this.validateNotTakenLoading = true;
  //   // console.log('this.mActualPacking.tag.code: ' + this.mActualPacking.tag.code);
  //   // console.log('control.value: ' + control.value);

  //   if (this.mActualPacking.tag.code == control.value) {
  //     // console.log('equal');
  //     this.validateNotTakenLoading = false;
  //     return new Promise((resolve, reject) => resolve(null));
  //   }

  //   return control
  //     .valueChanges
  //     .delay(800)
  //     .debounceTime(800)
  //     .distinctUntilChanged()
  //     .switchMap(value => this.packingService.getAllPackings({ tag_code: control.value }))
  //     .map(res => {

  //       this.validateNotTakenLoading = false;
  //       if (res.length == 0) {
  //         // console.log('empty');
  //         return control.setErrors(null);
  //       } else {
  //         // console.log('not empty');
  //         return control.setErrors({ uniqueValidation: 'code already exist' })
  //       }
  //     });
  // }
}


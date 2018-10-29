import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService, PackingService, FamiliesService } from '../../../../servicos/index.service';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-embalagem-editar',
  templateUrl: './embalagem-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class EmbalagemEditarComponent implements OnInit {

  public mPacking: FormGroup;
  public listOfFamilies: any[] = [];
  public inscricao: Subscription;
  public mId: string;
  public mActualPacking: any;
  public activePacking: boolean = false;

  constructor(
    private familyService: FamiliesService,
    private packingService: PackingService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.configureForm();
    this.loadFamilies();
    this.retrieveUser();
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    value.family = value.family._id;

    if (valid) {
      this.finishUpdate(value);
    }
  }

  loadFamilies() {
    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamilies = result;
    }, err => console.error(err));
  }

  retrieveUser() {
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.packingService.getPacking(this.mId).subscribe(result => {

        //console.log('result ...' + JSON.stringify(result));
        this.mActualPacking = result;
        (<FormGroup>this.mPacking).patchValue(result, { onlySelf: true });
      });
    });
  }

  finishUpdate(value) {
    this.packingService.editPacking(this.mId, value)
      .subscribe(result => {
        let message = {
          title: "Embalagem Atualizada",
          body: "A embalagem foi atualizada com sucesso"
        }
        this.toastService.show('/rc/cadastros/embalagem', message);
      });
  }


  configureForm() {
    this.mPacking = this.fb.group({
      tag: this.fb.group({
        code: ['',
          [Validators.required, Validators.pattern(/^((?!\s{2}).)*$/)], this.validateNotTaken.bind(this)],
        version: ['', [Validators.required, Validators.pattern(/^((?!\s{2}).)*$/)]],
        manufactorer: ['', [Validators.required, Validators.pattern(/^((?!\s{2}).)*$/)]]
      }),
      serial: ['', [Validators.required, Validators.pattern(/^((?!\s{2}).)*$/)]],
      type: ['', [Validators.required, Validators.pattern(/^((?!\s{2}).)*$/)]],
      weigth: ['', [Validators.required]],
      width: ['', [Validators.required]],
      heigth: ['', [Validators.required]],
      length: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
      family: [null, [Validators.required]],
      observations: ['', [Validators.maxLength(140)]],
      active: false
    });
  }

  public validateNotTakenLoading: boolean = false;
  validateNotTaken(control: AbstractControl) {
    this.validateNotTakenLoading = true;
    // console.log('this.mActualPacking.tag.code: ' + this.mActualPacking.tag.code);
    // console.log('control.value: ' + control.value);

    if (this.mActualPacking.tag.code == control.value) {
      // console.log('equal');
      this.validateNotTakenLoading = false;
      return new Promise((resolve, reject) => resolve(null));
    }

    return control
      .valueChanges
      .delay(800)
      .debounceTime(800)
      .distinctUntilChanged()
      .switchMap(value => this.packingService.getAllPackings({ tag_code: control.value }))
      .map(res => {
        
        this.validateNotTakenLoading = false;
        if (res.length == 0) {
          // console.log('empty');
          return control.setErrors(null);
        } else {
          // console.log('not empty');
          return control.setErrors({ uniqueValidation: 'code already exist' })
        }
      });
  }
}


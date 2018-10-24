import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { ToastService, PackingService, FamiliesService } from '../../../../servicos/index.service';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-embalagem-cadastro',
  templateUrl: './embalagem-cadastro.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class EmbalagemCadastroComponent implements OnInit {

  public mPacking : FormGroup;
  public listOfFamilies: any[] = []; 
  public activePacking: boolean = false;

  constructor(
    private familyService: FamiliesService,
    private packingService: PackingService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    
    this.configureForm();
    this.loadFamilies();
  }

  /**
   * Load the families in the select
   */
  loadFamilies(){
    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamilies = result;
    }, err => console.error(err));
  }
  
  /**
   * The form was submited
   * @param the form filled
   */
  onSubmit({ value, valid }: { value: any, valid: boolean }): void {
    
    value.family = value.family._id;

    if (valid) {
      this.finishRegister(value);
    }
  }

  /**
   * Complete the registration process
   * @param value 
   */
  finishRegister(value){
    this.packingService
      .createPacking(value)
      .subscribe(result => { 
        
        let message = {
          title: "Embalagem Cadastrada",
          body: "A embalagem foi cadastrada com sucesso"
        }
        this.toastService.show('/rc/cadastros/embalagem', message); 
      });
  }

  /**
   * Configure the form group
   */
  configureForm(){
    this.mPacking = this.fb.group({
      tag: this.fb.group({
        code: ['', 
          [Validators.required, Validators.pattern(/^[\w\d]+((\s)?[\w\d]+)*$/)], 
          this.validateNotTaken.bind(this)
        ],
        version: ['', [Validators.required, Validators.pattern(/^[\w\d]+((\s)?[\w\d]+)*$/)]],
        manufactorer: ['', [Validators.required, Validators.pattern(/^[\w\d]+((\s)?[\w\d]+)*$/)]]
      }),
      serial: ['', [Validators.required, Validators.pattern(/^[\w\d]+((\s)?[\w\d]+)*$/)]],
      type: ['', [Validators.required, Validators.pattern(/^[\w\d]+((\s)?[\w\d]+)*$/)]],
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

  public validateNotTakenLoading: boolean;
  validateNotTaken(control: AbstractControl) {
    this.validateNotTakenLoading = true;
    return control
      .valueChanges
      .delay(800)
      .debounceTime(800)
      .distinctUntilChanged()
      .switchMap(value => this.packingService.getAllPackings({ tag_code: control.value }))
      .map(res => {
        this.validateNotTakenLoading = false;

        if (res.length == 0) {
          // console.log('.');
          return control.setErrors(null);
        } else {
          // console.log('..');
          return control.setErrors({ uniqueValidation: 'code already exist' })
        }
      })
  }

}

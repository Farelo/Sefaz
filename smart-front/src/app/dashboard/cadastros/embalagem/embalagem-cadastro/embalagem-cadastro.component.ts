import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { ToastService, PackingService, FamiliesService } from '../../../../servicos/index.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
        this.router.navigate(['/rc/cadastros/embalagem']); 
        this.toastService.successModal('Embalagem criada') 
      });
  }

  /**
   * Configure the form group
   */
  configureForm(){
    this.mPacking = this.fb.group({
      tag: this.fb.group({
        code: ['', [Validators.required]],
        version: ['', [Validators.required]],
        manufactorer: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]]
      }),
      serial: ['', [Validators.required]],
      type: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      weigth: ['', [Validators.required]],
      width: ['', [Validators.required]],
      heigth: ['', [Validators.required]],
      length: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
      family: ['', [Validators.required]],
      observations: ''
    });
  }

}

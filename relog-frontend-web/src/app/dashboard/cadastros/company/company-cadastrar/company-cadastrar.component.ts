import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { CompaniesService } from '../../../../servicos/companies.service';
import { ToastService } from '../../../../servicos/index.service';
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-cadastrar',
  templateUrl: './company-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class CompanyCadastrarComponent implements OnInit {

  public newCompany: FormGroup;
  public typesOnSelect: any;
  public companyType: any;
  public submitted: boolean = false;

  //Mask
  public maskTel  = ['(', /[0-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
  public maskCep  = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskCNPJ = [/[0-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  //public maskUF = [/[A-Z]/, /[A-Z]/];
  
  constructor(public translate: TranslateService,
    protected companiesService: CompaniesService,
    protected toastService: ToastService,
    private fb: FormBuilder,
    private router: Router) { 
      
      if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
    }

  ngOnInit() {
    this.formProfile();
    this.fillSelectType();
  }

  fillSelectType() {
    this.typesOnSelect = [
      { label: "Owner", name: "owner" },
      { label: "Supplier", name: "supplier" },
      { label: "Client", name: "client" }];
  }

  formProfile() {
    this.newCompany = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^((?!\s{2}).)*$/)]],
      phone: ['', []],
      cnpj: ['', []],
      address: this.fb.group({
        city: ['', [Validators.pattern(/^((?!\s{2}).)*$/)]],
        street: ['', [Validators.pattern(/^((?!\s{2}).)*$/)]],
        cep: ['', []],
        uf: ['', [Validators.pattern(/^((?!\s{2}).)*$/)]]
      }),
      type: ['', [Validators.required]]
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    this.submitted = true;
    // console.log('submit...:' + JSON.stringify(value));
    // console.log('valid...:' + JSON.stringify(valid));

    if (valid) {
      value.type = value.type.name;

      this.companiesService
        .createCompany(value)
        .subscribe(result => { 
          this.router.navigate(['/rc/cadastros/company']); this.toastService.successModal('Empresa criada!') ;

        }, err => {
          // console.log(err);
          this.toastService.showError('', { title: "Erro na atualização", body: "Houve um problema na atualização da Empresa" });
        });
    }
  }

  trim(path){
    // console.log('path:' + path);
    // console.log('aqui:' + this.newCompany.controls[path].value);

    this.newCompany.controls[path].setValue(this.newCompany.get(path).value.replace(/\s+/g, ' ').replace(/^\s+|\s+$/, ''));
  }
}

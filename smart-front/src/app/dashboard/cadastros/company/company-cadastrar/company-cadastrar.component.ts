import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { CompaniesService } from '../../../../servicos/companies.service';
import { ToastService } from '../../../../servicos/index.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-company-cadastrar',
  templateUrl: './company-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class CompanyCadastrarComponent implements OnInit {

  public newCompany: FormGroup;
  public typesOnSelect: any = [];

  constructor(
    protected companiesService: CompaniesService,
    protected toastService: ToastService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.formProfile();
    this.fillSelectType();
  }

  fillSelectType() {
    this.typesOnSelect = [
      { label: "Owner", name: "owner" },
      { label: "Cliente", name: "client" }];
  }

  formProfile() {
    this.newCompany = this.fb.group({
      name: ['', [Validators.required]],
      phone: '',
      address: this.fb.group({
        city: '',
        street: '',
        cep: '',
        uf: ''
      }),
      type: ''
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {
    if (valid) {
      value.type = value.type.name;
      console.log(value);

      this.companiesService
        .createCompany(value)
        .subscribe(result => { this.router.navigate(['/rc/cadastros/company']); this.toastService.successModal('Empresa criada!') });
    }
  }

}

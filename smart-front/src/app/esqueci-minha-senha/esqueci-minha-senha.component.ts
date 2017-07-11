import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validator } from '@angular/forms';
import { ValidatorsModule, EmailValidators} from 'ngx-validators'
import {PasswordValidators} from 'ngx-validators'

@Component({
  selector: 'app-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.component.html',
  styleUrls: ['./esqueci-minha-senha.component.css']
})
export class EsqueciMinhaSenhaComponent implements OnInit {
  usuario: any = {
    email: null,
    senha: null
  };
  constructor() { }

  ngOnInit() {
  }

}

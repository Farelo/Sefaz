import { Component, OnInit, Injectable, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorsModule, EmailValidators} from 'ngx-validators'
import {PasswordValidators} from 'ngx-validators'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private usuarioAutenticado: boolean = false;

  emailInput: any;
  senhaInput: any;

  usuarios: any[] = [
    {email: 'admin@isi.com', senha: 'admin'},
    {email: 'admin2@isi.com', senha: 'admin2'},
    {email: 'admin3@isi.com', senha: 'admin3'}
  ];
  emailVazio: boolean = false;
  senhaVazia: boolean = false;
  senhaIncorreta: boolean = false;
  emailNaoCadastrado: boolean = false;
  constructor(private router: Router) { }

  // onSubmit(form){
  //   console.log("chegueiaqio");
  // }
  entrar(email, senha){
    this.emailVazio = false;
    this.senhaVazia = false;
    this.senhaIncorreta = false;
    this.emailNaoCadastrado = false;
    var a;
    var b = this.usuarios.length;
    for (a = 0; a < b; a++){
      if(email == this.usuarios[a].email){
          if(senha == this.usuarios[a].senha) {
            this.router.navigate(['/rc']);
            return true;
          }else{
            if((senha == null)||(senha.length == 0)){
              this.senhaInput = null;
              this.senhaVazia = true;
              return false;
            }else{
              this.senhaInput = null;
              this.senhaIncorreta = true;
              return false;
            }
          }
      }else{
        if(a == (b-1)){
          if((email == null)||(email.length == 0)){
            this.emailVazio = true;
            return false;
          }else {
            this.emailNaoCadastrado = true;
            return false;
          }
        }
      }
    }

  }
  prosseguir(){
    this.entrar(this.emailInput, this.senhaInput);
  }

  ngOnInit() {
  }

}

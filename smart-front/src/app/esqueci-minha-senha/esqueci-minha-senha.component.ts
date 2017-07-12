import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  emailInput: any;
  emailNaoCadastrado: boolean = false;
  aparecerMsgEmailInvalido: boolean = false;
  emailIgual: boolean = false;
  inputVazio: boolean = false;
  aparecerMsg: boolean = false;
  usuarios: any[] = [
    {email: 'admin@isi.com', senha: 'admin'},
    {email: 'admin2@isi.com', senha: 'admin2'},
    {email: 'admin3@isi.com', senha: 'admin3'}
  ];

  constructor(private router: Router) { }

  testar(input){
    this.emailNaoCadastrado = false;
    this.inputVazio = false;
    this.aparecerMsg = false;
    this.aparecerMsgEmailInvalido = true;
    var i;
    var f = this.usuarios.length;

    for(i = 0; i < f ; i ++ ){
      if(input == this.usuarios[i].email){
          this.emailIgual = true;
          alert("Mandamos o seu email!")
          this.router.navigate(['/rc']);
          return true;
      } else {
        if(i == (f-1)){
          if((input == null)||(input.length == 0)){
            this.inputVazio = true;
            return false;
          }else {
            this.aparecerMsg = true;
            return false;
          }
        }
      }
    }
  }
  limpar(){

  }

  prosseguir(){
    this.testar(this.emailInput);
  }

  ngOnInit() {
  }

}

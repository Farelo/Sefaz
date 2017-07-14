import { Component, OnInit} from '@angular/core';
import { Directive, forwardRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordValidators } from 'ngx-validators'
import {UniversalValidators} from 'ngx-validators'

declare var $:any;


@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnInit {
  private entrada: 'teste';
  private entrada2: any;
  private senhaFraca: boolean = false;
  private senhaModerada: boolean = false;
  private senhaForte: boolean = false;

  password: FormControl = new FormControl('', Validators.compose([
    UniversalValidators.minLength(6),
    PasswordValidators.alphabeticalCharacterRule(1),
    PasswordValidators.digitCharacterRule(1),
    PasswordValidators.lowercaseCharacterRule(1),
    PasswordValidators.uppercaseCharacterRule(1),
    PasswordValidators.specialCharacterRule(1)
    ]));

  usuarios: any[] = [
    {email: 'admin@isi.com', senha: 'admin'},
    {email: 'admin2@isi.com', senha: 'admin2'},
    {email: 'admin3@isi.com', senha: 'admin3'}
  ];


  constructor() { }

  ngOnInit() {
this.imprimir();  }
  imprimir(){
    console.log(this.password.value);
    // console.log(this.password.hasError(digitCharacterRule));
  }
  calcular(entrada, dirty, tamanho, minimo, numero, letras, min, mai, especial){
    if((!tamanho)){
      this.senhaFraca = false;
      this.senhaForte = false;
      this.senhaModerada = false;
    }else if((dirty && tamanho && !minimo && !numero && !letras && !min && !mai && !especial)==true){
      this.senhaForte = true;
      this.senhaFraca = false;
      this.senhaModerada = false;
    } else if((dirty && tamanho && !letras)==true){
      this.senhaFraca = true;
      this.senhaForte = false;
      this.senhaModerada = false;
    }
  }

//   calcular(){
//     $(function(){
//     $('#password').keyup(function(){
//         var pass_val = $('#password').val();
//         var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
//         var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
//         var okRegex = new RegExp("(?=.{6,}).*", "g");
//
//         if(okRegex.test(pass_val) === false){
//             $('.inputSenha').addClass('weak');
//             $('.inputSenha').removeClass('medium');
//             $('.inputSenha').removeClass('strong');
//
//             $('.senhaFraca').css('display','flex');
//             $('.senhaForte').css('display','none');
//             $('.senhaModerada').css('display','none');
//
//         }else if(strongRegex.test(pass_val)){
//             $('.inputSenha').addClass('strong');
//             $('.inputSenha').removeClass('medium');
//             $('.inputSenha').removeClass('weak');
//
//             $('.senhaForte').css('display','flex');
//             $('.senhaFraca').css('display','none');
//             $('.senhaModerada').css('display','none');
//
//         }else if(mediumRegex.test(pass_val)){
//             $('.inputSenha').addClass('medium');
//             $('.inputSenha').removeClass('weak');
//             $('.inputSenha').removeClass('strong');
//
//             $('.senhaModerada').css('display','flex');
//             $('.senhaForte').css('display','none');
//             $('.senhaFraca').css('display','none');
//         }else{
//             $('.inputSenha').addClass('medium');
//             $('.inputSenha').removeClass('weak');
//             $('.inputSenha').removeClass('strong');
//
//             $('.senhaModerada').css('display','flex');
//             $('.senhaForte').css('display','none');
//             $('.senhaFraca').css('display','none');
//         }
//     });
// });
//   }

}

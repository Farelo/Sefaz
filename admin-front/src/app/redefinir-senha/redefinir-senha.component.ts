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
  private entrada2: any;
  private senhaFraca: boolean = false;
  private senhaModerada: boolean = false;
  private senhaForte: boolean = false;
  private preCaracteres: boolean = false;
  private preNumeros: boolean = false;
  private preLetras: boolean = false;
  private senhasIguais: boolean = false;
  private senhasDiferentes: boolean = false;

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


  constructor(private router: Router) { }

  ngOnInit() {
this.imprimir();  }
  imprimir(){
    console.log(this.password.value);
    // console.log(this.password.hasError(digitCharacterRule));
  }
  calcular(entrada, dirty, tamanho, minimo, numero, min, mai, especial){
    var i = 0;
    console.log(entrada);
    if((!tamanho)){
      this.senhaFraca = false;
      this.senhaForte = false;
      this.senhaModerada = false;
      this.preCaracteres = false;
      this.preNumeros = false;
      this.preLetras = false;
    }
    if(!numero){i++;}
    if(!min){i++;}
    if(!mai){i++;}
    if(!especial){i++;}

    if((dirty && tamanho && !minimo && (i==4))==true){
      this.senhaForte = true;
      this.senhaFraca = false;
      this.senhaModerada = false;
      i=0;
    } else if((dirty && tamanho && ((i<2)||(minimo && i<3)||(i==3 && minimo)))==true){
      this.senhaFraca = true;
      this.senhaForte = false;
      this.senhaModerada = false;
      i=0;
    } else {
      this.senhaModerada = true;
      this.senhaFraca = false;
      this.senhaForte = false;
      i=0;
    }
    if((!tamanho)){
      this.senhaFraca = false;
      this.senhaForte = false;
      this.senhaModerada = false;
      i=0;
    }
  }
  checar(){
    if(this.password.value == this.entrada2){
      if(this.password.value.length>0 || this.entrada2.length>0){
        if(!this.senhaFraca){
        this.senhasIguais = true;
        return true;
        //A função só retorna true se a senha tiver pelo menos moderada.
        }
        return false;
      }
      return false;
    } else {
      this.senhasDiferentes = true;
      return false;
    }
  }

  redefinir(){
    //Redefinir a senha real, aqui eu vou só avançar
    if(this.checar()){
      //Aparecer tela dizendo que a senha foi redefinida e mandar pra o login
      this.router.navigate(['/login']);
    }
  }
}

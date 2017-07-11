import { Component, OnInit } from '@angular/core';
import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnInit {
  usuario: any = {
    email: null,
    senha: null
  };
  entrada: any;
  private senhaFraca: boolean = false;
  private senhaModerada: boolean = false;
  private senhaForte: boolean = false;

  constructor() { }

  ngOnInit() {

  }

  calcular(){
    $(function(){
    $('#password').keyup(function(){
        var pass_val = $('#password').val();
        var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        var okRegex = new RegExp("(?=.{6,}).*", "g");

        if(okRegex.test(pass_val) === false){
            $('.inputSenha').addClass('weak');
            $('.inputSenha').removeClass('medium');
            $('.inputSenha').removeClass('strong');

            $('.senhaFraca').css('display','flex');
            $('.senhaForte').css('display','none');
            $('.senhaModerada').css('display','none');

        }else if(strongRegex.test(pass_val)){
            $('.inputSenha').addClass('strong');
            $('.inputSenha').removeClass('medium');
            $('.inputSenha').removeClass('weak');

            $('.senhaForte').css('display','flex');
            $('.senhaFraca').css('display','none');
            $('.senhaModerada').css('display','none');

        }else if(mediumRegex.test(pass_val)){
            $('.inputSenha').addClass('medium');
            $('.inputSenha').removeClass('weak');
            $('.inputSenha').removeClass('strong');

            $('.senhaModerada').css('display','flex');
            $('.senhaForte').css('display','none');
            $('.senhaFraca').css('display','none');
        }else{
            $('.inputSenha').addClass('medium');
            $('.inputSenha').removeClass('weak');
            $('.inputSenha').removeClass('strong');
            
            $('.senhaModerada').css('display','flex');
            $('.senhaForte').css('display','none');
            $('.senhaFraca').css('display','none');
        }
    });
});
  }

}

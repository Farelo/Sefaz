import { Component, OnInit, Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../servicos/auth.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'reciclapac-login',
  templateUrl: './reciclapac-login.component.html',
  styleUrls: ['./reciclapac-login.component.css']
})
export class ReciclapacLoginComponent implements OnInit {
  public login: FormGroup;
  public  erroAuth = false;
  public inscricao: Subscription;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
  ) { }

  onSubmit(password,email): void {
      console.log("aqui");
      console.log(email);
      this.authenticationService.login(password, email).subscribe(result =>  {
        if(result){
          this.erroAuth = false;
          this.router.navigate(['/rc/home']);
        }else{
          this.erroAuth = true;
        }
      })
  }

  ngOnInit() {
    console.log("aqui");
    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let password = params ['password'];
        let email = params ['email'];
        this.onSubmit(password,email);
      });
    }

}

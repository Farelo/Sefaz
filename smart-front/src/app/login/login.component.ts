import { Component, OnInit, Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService, AuthenticationService } from '../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public login: FormGroup;
  public  erroAuth = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private toastService: ToastService
  ) { }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {
    console.log(value)
    if(valid){
      this.authenticationService.login(value.password, value.email).subscribe(result =>  {

        if(result.length != 0){
          this.erroAuth = false;
          this.router.navigate(['/rc/home'])

        }else{
          this.erroAuth = true;
        }
      }, err => this.toastService.warningunathorized())
    }
  }

  ngOnInit() {
    this.login = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

}

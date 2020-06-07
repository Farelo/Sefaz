import { Component, OnInit, Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService, AuthenticationService } from '../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public login: FormGroup;
  public erroAuth = false;

  constructor(public translate: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private toastService: ToastService) {

    let browserLang = this.translate.getBrowserLang();
    if(browserLang == undefined) browserLang = 'pt';

    console.log(browserLang);

    this.translate.use(browserLang.match(/en|es|pt/) ? browserLang : 'pt');
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    if (valid) {
      this.authenticationService.login(value.password, value.email).subscribe(result => {

        // console.log('result: ' + JSON.stringify(result));

        if (result) {
          this.erroAuth = false;
          this.router.navigate(['/rc/home'])

        } else {
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

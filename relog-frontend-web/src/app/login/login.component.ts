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
    if (browserLang == undefined) browserLang = 'pt';

    console.log(browserLang);

    this.translate.use(browserLang.match(/en|es|pt/) ? browserLang : 'pt');
  }

  async onSubmit({ value, valid }: { value: any, valid: boolean }) {

    if (valid) {
      let asyncResult = await this.authenticationService
        .login(value.password, value.email)
        .toPromise() 
        .catch(err => this.toastService.warningunathorized())
       
        if(asyncResult){ 
          if (asyncResult) {
            this.erroAuth = false;
            await this.authenticationService.auth(asyncResult); 
            this.router.navigate(['/rc/home'])

          } else {
            this.erroAuth = true;
          }  
        }
        // .then(result => {
        //   console.log('authenticationService result: ' + JSON.stringify(result));
        //   console.log('A')
        //   if (result) {
        //     this.erroAuth = false;
        //     this.authenticationService.auth(result);
        //     console.log('D')
        //     this.router.navigate(['/rc/home'])

        //   } else {
        //     this.erroAuth = true;
        //   }
        // }) //err => 
        // .catch(err => this.toastService.warningunathorized())
    }
  }

  ngOnInit() {
    this.login = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

}

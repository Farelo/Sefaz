import { Component, OnInit, Injectable, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { ToastService, AuthenticationService } from "../servicos/index.service";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public login: FormGroup;
  public erroAuth = false;

  public email: string;
  public password: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private toastService: ToastService
  ) {}

  async onSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (valid) {
      try {
        let result = await this.authenticationService.login(
          value.password,
          value.email
        );
        console.log("login: result", result);

        if (result == 200) {
          this.erroAuth = false;
          this.router.navigate(["/rc/home"]);
        } else {
          if (result == 400) {
            this.toastService.warningunathorized();
            this.erroAuth = true;
          }
          if (result == 402) {
            this.toastService.warningExpiredContract();
          }
        }
      } catch (error) {
        console.log("error submit", error);
      }
    }
  }

  ngOnInit() {
    this.login = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }
}

import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ToastService } from '../../../../servicos/toast.service';
import { UserService } from '../../../../servicos/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-user-adicionar',
  templateUrl: './user-adicionar.component.html',
  styleUrls: ['./user-adicionar.component.css'],
})

export class UserAdicionarComponent implements OnInit {
  @ViewChild('drawer') drawer: ElementRef;
  public user : FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    private userService: UserService,
  ) {}



  onSubmit({ value, valid }: { value: any, valid: boolean }): void {
    if(valid){
      this.userService.createUser(value)
                      .subscribe(result => this.toastService.success('/rc/home', 'Usuário'), err => this.toastService.error(err));
    }

  }

  ngOnInit() {

      this.user = this.fb.group({
        url: ['', [Validators.required]],
        email: ['', [Validators.required]],
        port: ['', [Validators.required]],
        company: ['', [Validators.required]],
        profile: ['AdminFactory', [Validators.required]]

      });

  }

}

import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ToastService } from '../../../../servicos/toast.service';
import { UserService } from '../../../../servicos/user.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-user-editar',
  templateUrl: './user-editar.component.html',
  styleUrls: ['./user-editar.component.css'],
})

export class UserEditarComponent implements OnInit {
  @ViewChild('drawer') drawer: ElementRef;
  public user : FormGroup;
  public inscricao: Subscription;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private userService: UserService,
  ) {}



  onSubmit({ value, valid }: { value: any, valid: boolean }): void {
    if(valid){
      this.userService.updateUser(value._id,value)
                      .subscribe(result => this.toastService.edit('/rc/home/lista', 'Usuário'), err => this.toastService.error(err));
    }

  }

  ngOnInit() {

      this.user = this.fb.group({
        url: ['', [Validators.required]],
        email: ['', [Validators.required]],
        port: ['', [Validators.required]],
        company: ['', [Validators.required]],
        profile: ['AdminFactory', [Validators.required]],
        _id:['', [Validators.required]],
        __v:['']

      });

      this.inscricao = this.route.params.subscribe(
        (params: any)=>{
          let id = params['id'];
          this.userService.retrieveUser(id).subscribe(result => {

            (this.user)
                    .patchValue(result.data);

          });
        }
      )

  }

}

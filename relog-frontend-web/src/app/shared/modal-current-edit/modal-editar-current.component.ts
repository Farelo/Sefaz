import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { AuthenticationService, CEPService, ToastService, ProfileService } from '../../servicos/index.service';

declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-editar-current.component.html',
  styleUrls: ['./modal-editar-current.component.css']
})
export class ModalCurrentEditarComponent implements OnInit {

  public staff :  FormGroup;
  public address: any = {};
  public invalidEmail = false;

  public mask = [/[0-9]/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'-', /\d/, /\d/];
  public maskCep = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskTel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];
  public maskCel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];
  public alerts: any = [];

  constructor(
    public activeModal: NgbActiveModal,
    private authenticationService: AuthenticationService,
    private ProfileService : ProfileService,
    private CEPService : CEPService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastService: ToastService

  ) { }

  ngOnInit() {
    this.formProfile();
    this.tamanho();
  }

  tamanho(){
    var mapa = $('.teste');
    var filho = $('.modalFilho');
    var pai1 = filho.parent();
    var pai2 = pai1.parent();
    var pai3 = pai2.parent();
    pai3.css({'max-width': '800px'});
  }


  formProfile(){


    this.staff = this.fb.group({
        profile: ['',[Validators.required]],
        password: ['',[Validators.required]],
        email: ['',[Validators.required, Validators.email]],
        user: ['',[Validators.required]],
        street: ['',[Validators.required]],
        city: ['',[Validators.required]],
        telephone: [''],
        cellphone: [''],
        neighborhood: ['',[Validators.required]],
        uf: ['',[Validators.required]],
        cep: ['',[Validators.required]],
        _id: ['',[Validators.required]],
        __v: ['',[Validators.required]]

      });

      this.ProfileService.retrieveProfile(this.authenticationService.currentUser()._id).subscribe(response => {
        let result = response.data;

        (this.staff)
                  .patchValue(result, { onlySelf: true });

      })

  }



  evaluateEmail(){
    if(this.staff['controls'].email.value){
      this.ProfileService.retrieveProfileByEmail(this.staff['controls'].email.value).subscribe(result => {

        if(result.data.length > 0) {
          this.invalidEmail = true;
        }else{
          this.invalidEmail = false;
        };
      });
    }

  }




  onSubmit({ value, valid }: { value: any, valid: boolean }):void {
      

      if(valid ){

        this.ProfileService.updateProfile(value._id,value).subscribe(result => {
            this.toastService.edit('','Funcionário');
            this.authenticationService.updateCurrentUser();
            this.closeModal();
             }, err => this.toastService.error(err));

      }

  }

  getAddress(){

    if(this.staff['controls'].cep.value){
      this.CEPService.getAddress(this.staff['controls'].cep.value).subscribe(result => {
         this.staff['controls'].neighborhood.setValue(result.data.bairro);
         this.staff['controls'].city.setValue( result.data.localidade);
         this.staff['controls'].uf.setValue(result.data.uf);
         this.staff['controls'].street.setValue(result.data.logradouro);
      })
    }
  }

  closeModal(){
      this.activeModal.close();
  }


}

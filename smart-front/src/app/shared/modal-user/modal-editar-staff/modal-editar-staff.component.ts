import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserComponent } from '../modal-user.component';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { AuthenticationService, ToastService, CEPService, ProfileService } from '../../../servicos/index.service';

declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-editar-staff.component.html',
  styleUrls: ['./modal-editar-staff.component.css']
})
export class ModalStaffEditarComponent implements OnInit {
  @Input() id;

  public isAdmin : any;
  public next = false;
  public staff :  FormGroup;
  public address: any = {};
  public submitted = false;
  public invalidEmail = false;
  public mask = [/[0-9]/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'-', /\d/, /\d/];
  public maskCep = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskTel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];
  public maskCel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];


  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private ProfileService : ProfileService,
    private authenticationService : AuthenticationService,
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
        official_supplier: [''],
        official_logistic: [''],
        cellphone: [''],
        neighborhood: ['',[Validators.required]],
        uf: ['',[Validators.required]],
        cep: ['',[Validators.required]],
        _id: ['',[Validators.required]],
        __v: ['',[Validators.required]]

      });

      if(this.authenticationService.currentUser().supplier
      || this.authenticationService.currentUser().logistic
      || this.authenticationService.currentUser().official_supplier
      || this.authenticationService.currentUser().official_logistic){
        this.isAdmin = false;
      }else{
        this.isAdmin = true;
      }

      this.ProfileService.retrieveProfile(this.id).subscribe(response => {
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
     

      if(valid && !this.invalidEmail){

        if(this.authenticationService.currentUser().supplier || this.authenticationService.currentUser().official_supplier){
          delete value.official_logistic;
        }else if(this.authenticationService.currentUser().logistic || this.authenticationService.currentUser().official_logistic){
          delete value.official_supplier;
        }else{
          delete value.official_supplier;
          delete value.official_logistic;
        }

        this.ProfileService.updateProfile(value._id,value).subscribe(result => {
            this.toastService.edit('','Funcionário');
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
    if ( !this.authenticationService.currentUser().official_supplier  && !this.authenticationService.currentUser().official_logistic){
      const modalRef = this.modalService.open(ModalUserComponent,{backdrop: "static", size: "lg"});
    }
    this.activeModal.close();
  }

}

import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../../servicos/profile.service';
import { CEPService } from '../../../servicos/cep.service';
import { ModalUserComponent } from '../modal-user.component';
import { ActivatedRoute } from '@angular/router';
import { ModalSupplierRegisterComponent } from '../modal-register-supplier/modal-register-supplier.component';
import { ModalLogisticRegisterComponent } from '../modal-register-logistic/modal-register-logistic.component';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { ToastService } from '../../../servicos/toast.service';
import { AuthenticationService } from '../../../servicos/auth.service';

declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-register-staff.component.html',
  styleUrls: ['./modal-register-staff.component.css']
})
export class ModalStaffRegisterComponent implements OnInit {
  public isAdmin : any;
  public next = false;
  private perfil = "FUNCIONÁRIO";
  public staff :  FormGroup;
  public address: any = {};
  public submitted = false;
  public invalidEmail = false;
  public center: any;
  public pos : any;
  public users = [];
  public newcep = '';
  public newtelefone = '';
  public mask = [/[0-9]/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'-', /\d/, /\d/];
  public maskCep = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskTel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];
  public maskCel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];
  public alerts: any = [];

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
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
        cellphone: [''],
        official_supplier: [''],
        official_logistic: [''],
        neighborhood: ['',[Validators.required]],
        uf: ['',[Validators.required]],
        cep: ['',[Validators.required]]
      });

    if(this.authenticationService.currentUser().supplier){
      this.staff['controls'].profile.setValue("StaffSupplier");
      this.staff['controls'].official_supplier.setValue(this.authenticationService.currentUser().supplier._id);
      this.isAdmin = false;
    }else if(this.authenticationService.currentUser().logistic ){
      this.staff['controls'].profile.setValue("StaffLogistic");
      this.staff['controls'].official_logistic.setValue(this.authenticationService.currentUser().logistic._id);
      this.isAdmin = false;
    }else{
      this.isAdmin = true;
      this.staff['controls'].profile.setValue("AdminFactory");
    }


  }


  onChange(event){

    if(event == "FORNECEDOR"){

      const modalRef = this.modalService.open(ModalSupplierRegisterComponent,{backdrop: "static", size: "lg"});
      this.activeModal.close();
    }else if(event == "OPERADOR LOGÍSTICO"){
      const modalRef = this.modalService.open(ModalLogisticRegisterComponent,{backdrop: "static", size: "lg"});
      this.activeModal.close();
    }
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
        if(this.authenticationService.currentUser().supplier){
          delete value.official_logistic;
        }else if(this.authenticationService.currentUser().logistic ){
          delete value.official_supplier;
        }else{
          delete value.official_supplier;
          delete value.official_logistic;
        }
        this.ProfileService.createProfile(value).subscribe(result => {
            this.toastService.successModal('Funcionário');
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
    const modalRef = this.modalService.open(ModalUserComponent,{backdrop: "static", size: "lg"});
    modalRef.componentInstance.view = 'GERENCIAR';
    this.activeModal.close();
  }

}

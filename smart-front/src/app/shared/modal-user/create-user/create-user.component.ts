import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserComponent } from '../modal-user.component';
import { ModalLogisticRegisterComponent } from '../modal-register-logistic/modal-register-logistic.component';
import { ModalStaffRegisterComponent } from '../modal-register-staff/modal-register-staff.component';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ToastService, LogisticService, GeocodingService, CEPService, PlantsService, ProfileService, SuppliersService, CompaniesService, UsersService } from '../../../servicos/index.service';
import { constants } from '../../../../environments/constants';
import { PasswordValidation } from 'app/shared/validators/passwordValidator';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  public newUser: FormGroup;
  public autocomplete: google.maps.places.Autocomplete;
  public submitted = false;
  public invalidEmail = false;

  public companiesOnSelect: any[] = [];
  public companySearch: any = {};

  public rolesOnSelect: any = [];
  public userType: any;
  public userCompany: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private companiesService: CompaniesService,
    private usersService: UsersService, 
    private toastService: ToastService,
    private fb: FormBuilder) { }

  ngOnInit() {    
    this.formProfile();
    this.fillSelectType();
    this.getCompaniesOnSelect();
  }

  fillSelectType(){
    this.rolesOnSelect = [
      { label: "Administrador", name: "admin" },
      { label: "Usuário", name: "user" }]; 
  }

  formProfile() {
    this.newUser = this.fb.group({
      role: ['', [Validators.required]],
      full_name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[\w\d]+((\s)?[\w\d]+)*$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
      company: ['', [Validators.required]]
    }, {
        validator: PasswordValidation.MatchPassword // your validation method
      });
  }

  getCompaniesOnSelect(){
    
    this.companiesService.getAllCompanies().subscribe(result => { 
      //console.log("result: " + JSON.stringify(result));
      this.companiesOnSelect = result;
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    this.submitted = true;
    
    if (valid) { 
      
      delete value.confirm_password;
      value.role = value.role.name;
      value.company = value.company._id;
            
      this.usersService.createUser(value).subscribe(result => {
        //console.log("result: " + JSON.stringify(result));
        this.closeModal();
        this.toastService.successModal('Usuário');
      });
    }
  }

  closeModal() {
    const modalRef = this.modalService.open(ModalUserComponent, { backdrop: "static", size: "lg" });
    modalRef.componentInstance.view = 'GERENCIAR';
    this.activeModal.close();
  }

}

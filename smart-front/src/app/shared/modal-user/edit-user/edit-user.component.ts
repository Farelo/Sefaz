import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserComponent } from '../modal-user.component';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ToastService, CompaniesService, UsersService } from '../../../servicos/index.service';
import { constants } from '../../../../environments/constants';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  @Input() mUser: any;

  public full_name: string;
  public email: string;
  public password: string;
  public userType: any;
  public userCompany: any;




  public newUser: FormGroup;
  public autocomplete: google.maps.places.Autocomplete;
  public submitted = false;
  public invalidEmail = false;

  public companiesOnSelect: any[] = [];
  public companySearch: any = {};

  public rolesOnSelect: any = [];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private companiesService: CompaniesService,
    private usersService: UsersService,
    private toastService: ToastService,
    private fb: FormBuilder) { }

  ngOnInit() {
    console.log('mUser onInit: ' + JSON.stringify(this.mUser));
    this.formProfile();
    this.fillSelectType();
    this.getCompaniesOnSelect();
    this.fillActualUser();
  }
  
  fillSelectType() {
    this.rolesOnSelect = [
      { label: "Administrador", name: "admin" },
      { label: "Usuário", name: "user" }];
  }

  formProfile() {
    this.newUser = this.fb.group({
      role: ['', [Validators.required]],
      full_name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
      company: ['', [Validators.required]]
    }, {
        validator: PasswordValidation.MatchPassword // your validation method
      });
  }

  fillActualUser(){
    this.full_name = this.mUser.full_name;
    this.email = this.mUser.email;
    this.password = this.mUser.password;
    this.userCompany = this.mUser.company;

    if (this.mUser.role == this.rolesOnSelect[0].name)
      this.userType = this.rolesOnSelect[0];
    if (this.mUser.role == this.rolesOnSelect[1].name)
      this.userType = this.rolesOnSelect[1];
    console.log("userType.: " + JSON.stringify(this.userType));
  }

  getCompaniesOnSelect() {

    this.companiesService.getAllCompanies().subscribe(result => {
      console.log("result.: " + JSON.stringify(result));
      this.companiesOnSelect = result;

    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    this.submitted = true;

    if (valid) {
      delete value.confirm_password;
      value.role = value.role.name;
      value.company = value.company._id;
      
      let userId = this.mUser._id
      //console.log('userId: ' + userId);

      this.usersService.editUser(userId, value).subscribe(result => {
        //console.log("result: " + JSON.stringify(result));
        this.closeModal();
        this.toastService.successUpdate('Usuário');
      });
    }
  }

  closeModal() {
    const modalRef = this.modalService.open(ModalUserComponent, { backdrop: "static", size: "lg" });
    modalRef.componentInstance.view = 'GERENCIAR';
    this.activeModal.close();
  }

}

/**
 * Form Validator for "confirm password"
 */
export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirm_password').value; // to get value in input tag
    if (password != confirmPassword) {
      AC.get('confirm_password').setErrors({ MatchPassword: true })
    } else {
      return null
    }
  }
}
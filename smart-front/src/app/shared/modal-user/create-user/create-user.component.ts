import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserComponent } from '../modal-user.component';
import { ModalLogisticRegisterComponent } from '../modal-register-logistic/modal-register-logistic.component';
import { ModalStaffRegisterComponent } from '../modal-register-staff/modal-register-staff.component';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastService, LogisticService, GeocodingService, CEPService, PlantsService, ProfileService, SuppliersService, CompaniesService } from '../../../servicos/index.service';
import { constants } from '../../../../environments/constants';

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

  public mSelectedCompany: any;
  public companiesOnSelect: any[] = [];
  public companySearch: any = {};

  
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private companiesService: CompaniesService,
    private CEPService: CEPService, 
    private fb: FormBuilder) { }

  ngOnInit() {    
    this.formProfile();
    this.getCompaniesOnSelect();
  }

  formProfile() {
    this.newUser = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
      company: ['', [Validators.required]]
    });
  }

  getCompaniesOnSelect(){
    
    this.companiesService.getAllCompanies().subscribe(result => { 
      console.log("result: " + JSON.stringify(result));
      this.companiesOnSelect = result;
    });
  }

  selectedCompany(event: any){
    console.log("event: " + JSON.stringify(event)); 
  }

  evaluateForm() {
    if (this.newUser.valid && !this.invalidEmail) {
      //this.next = true;

    } else {
      this.submitted = true;
    }
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    let mUser = this.newUser.value;

    if (valid) {
      
      console.log("submited"); 
    }
  }

  closeModal() {
    const modalRef = this.modalService.open(ModalUserComponent, { backdrop: "static", size: "lg" });
    modalRef.componentInstance.view = 'GERENCIAR';
    this.activeModal.close();
  }

}

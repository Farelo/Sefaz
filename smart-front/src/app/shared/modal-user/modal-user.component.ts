import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Supplier } from '../../shared/models/supplier';
import { Profile } from '../../shared/models/profile';
import { Plant } from '../../shared/models/plant';
import { ModalSupplierRegisterComponent } from './modal-register-supplier/modal-register-supplier.component';
import { ModalStaffRegisterComponent } from './modal-register-staff/modal-register-staff.component';
import { ModalSupplierEditarComponent } from './modal-editar-supplier/modal-editar-supplier.component';
import { ModalLogisticEditarComponent } from './modal-editar-logistic/modal-editar-logistic.component';
import { ModalStaffEditarComponent } from './modal-editar-staff/modal-editar-staff.component';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { ModalDeleteComponent } from '../../shared/modal-delete/modal-delete.component';
import { Pagination } from '../../shared/models/pagination';
import { AuthenticationService, ToastService, GeocodingService, CEPService, PlantsService, ProfileService, SuppliersService } from '../../servicos/index.service';
import { constants } from '../../../environments/constants';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
  
  @Input() view;
  public userData: any[] = [];
  public actualPage = -1;

  constructor(
    public activeModal: NgbActiveModal,
    private profileService: ProfileService, 
    private modalService: NgbModal) { }

  ngOnInit() {

    this.getUsers();
  }

  getUsers(){
    
    this.profileService.getUsers().subscribe(result => {
      this.userData = result;
    });
  }

  createUser(){
    const modalRef = this.modalService.open(CreateUserComponent, { backdrop: "static"});
    this.activeModal.close();
  }

  editUser(user: any){

    const modalRef = this.modalService.open(EditUserComponent, { backdrop: "static" });
    modalRef.componentInstance.mUser = user;
    modalRef.componentInstance.mType = 'USER';
    this.activeModal.close();
  }

  addUsers(){
    if(this.isAdmin){
      const modalRef = this.modalService.open(ModalSupplierRegisterComponent, {backdrop: "static", size: "lg"});
    }else{
      const modalRef = this.modalService.open(ModalStaffRegisterComponent, {backdrop: "static", size: "lg"});
    }
    this.activeModal.close();
  }

  removeProfile(profile):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = profile;
    modalRef.componentInstance.mType = "USER";
    
    modalRef.result.then((result) => {
      this.getUsers();
    });
  }

  getTypeLabel(type: string): string{
    return type=='admin' ? 'Administrador' : 'Usuário';
  }

  // pageChanged(page: any): void{
  //   this.userData.meta.page = page;
  //   this.getUsers();
  // }

  isAdmin() {
    if(JSON.parse(localStorage.getItem('currentUser'))) {
      if (JSON.parse(localStorage.getItem('currentUser')).role == constants.ADMIN){
        return true;
      }
    }
    return false;
  }

}

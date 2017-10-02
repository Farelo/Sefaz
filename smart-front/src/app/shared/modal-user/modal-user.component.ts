import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuppliersService } from '../../servicos/suppliers.service';
import { ProfileService } from '../../servicos/profile.service';
import { PlantsService } from '../../servicos/plants.service';
import { CEPService } from '../../servicos/cep.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Supplier } from '../../shared/models/supplier';
import { Profile } from '../../shared/models/profile';
import { Plant } from '../../shared/models/plant';
import { ModalSupplierRegisterComponent } from './modal-register-supplier/modal-register-supplier.component';
import { ModalStaffRegisterComponent } from './modal-register-staff/modal-register-staff.component';
import { ModalSupplierEditarComponent } from './modal-editar-supplier/modal-editar-supplier.component';
import { ModalLogisticEditarComponent } from './modal-editar-logistic/modal-editar-logistic.component';
import { ModalStaffEditarComponent } from './modal-editar-staff/modal-editar-staff.component';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { GeocodingService } from '../../servicos/geocoding.service';
import { ToastService } from '../../servicos/toast.service';
import { ModalDeleteComponent } from '../../shared/modal-delete/modal-delete.component';
import { Pagination } from '../../shared/models/pagination';
import { AuthenticationService } from '../../servicos/auth.service';

declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
  @Input() view;
  public isAdmin : any;
  public data: Pagination = new Pagination({meta: {page : 1}});
  public alerts: any = [];

  constructor(
    public activeModal: NgbActiveModal,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {

    this.getUsers();
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

  getUsers(){
    if(!this.authenticationService.currentUser().supplier){
      this.isAdmin = true;
      this.profileService.getProfilePagination(10,this.data.meta.page).subscribe(result => {console.log(result);this.data = result});
    }else{
      this.profileService.getProfilePaginationSupplier(10,this.data.meta.page,this.authenticationService.currentUser().supplier._id).subscribe(result => {console.log(result);this.data = result});
      this.isAdmin = false;
    }

  }


  editUser(user: any){
    console.log(user);
    if(user.profile === "Supplier"){
      const modalRef = this.modalService.open(ModalSupplierEditarComponent,{backdrop: "static", size: "lg"});
      modalRef.componentInstance.id = user.user._id;
      this.activeModal.close();
    }else if(user.profile === "Logistic"){
      const modalRef = this.modalService.open(ModalLogisticEditarComponent,{backdrop: "static", size: "lg"});
      modalRef.componentInstance.id = user.user._id;
      this.activeModal.close();
    }else{
      const modalRef = this.modalService.open(ModalStaffEditarComponent,{backdrop: "static", size: "lg"});
      modalRef.componentInstance.id = user._id;
      this.activeModal.close();
    }


  }

  addUsers(){
    if(this.isAdmin){
      const modalRef = this.modalService.open(ModalSupplierRegisterComponent,{backdrop: "static", size: "lg"});
    }else{
      const modalRef = this.modalService.open(ModalStaffRegisterComponent,{backdrop: "static", size: "lg"});

    }
    this.activeModal.close();
  }


  removeProfile(profile):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = profile;
    modalRef.componentInstance.type = "profile";
    modalRef.result.then((result) => {
      if(result === "remove") this.getUsers();
    });
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.getUsers();
  }


}

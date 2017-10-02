import { Component, OnInit, NgZone } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserComponent } from '../../../shared/modal-user/modal-user.component';
import { AuthenticationService } from '../../../servicos/auth.service';
import { ModalLogisticEditarComponent } from '../../../shared/modal-user/modal-editar-logistic/modal-editar-logistic.component';
import { ModalStaffEditarComponent } from '../../../shared/modal-user/modal-editar-staff/modal-editar-staff.component';
import { ActivatedRoute, Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
menuAparecer: boolean = false;
telaGrande: boolean = false;
altura: any;
public currentUser  : any;
largura: any;
closeResult: string;

  constructor(
    private ngZone:NgZone,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.funcaoTop();
    this.menuAparecer = false;
    this.currentUser = this.authenticationService.currentUser();
    // this.modalOptions.backdrop =  'static';
  }

  funcaoTop(){
    $('.scroll').click(function() {
        // $('label').click();
        return false;
    });
  }

  mudar(){
    if(this.menuAparecer == false ){
      this.menuAparecer = true;
    } else{
      this.menuAparecer = false;
    }
  }

  openModal(){
    this.mudar();
    const modalRef = this.modalService.open(ModalUserComponent,{backdrop: "static", size: "lg"});
    modalRef.componentInstance.view = 'GERENCIAR';
  }

  openModalEditar(){
    this.mudar();
    if(this.authenticationService.currentUser().logistic){
      const modalRef = this.modalService.open(ModalLogisticEditarComponent,{backdrop: "static", size: "lg"});
      modalRef.componentInstance.id = this.authenticationService.currentUser().logistic._id;
    }else{
      const modalRef = this.modalService.open(ModalStaffEditarComponent,{backdrop: "static", size: "lg"});
      modalRef.componentInstance.id = this.authenticationService.currentUser()._id;
    }

  }

  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}

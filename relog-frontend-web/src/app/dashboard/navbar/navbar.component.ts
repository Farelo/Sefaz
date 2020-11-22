import { Component, OnInit, NgZone } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserComponent } from '../../shared/modal-user/modal-user.component';
import { ModalSettings } from '../../shared/modal-settings/modal-settings.component';
import { AuthenticationService } from '../../servicos/index.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public menuAparecer: boolean = false;
  public currentUser: any;

  constructor(
    private ngZone: NgZone,
    private modalService: NgbModal,
    public authenticationService: AuthenticationService,
    private router: Router) {

  }

  ngOnInit() {
    this.funcaoTop();
    this.menuAparecer = false;
    this.currentUser = this.authenticationService.currentUser();
  }

  funcaoTop() {
    $('.scroll').click(function () {
      // $('label').click();
      return false;
    });
  }

  posicionarPopOver() {
    $('.arrow').css({
      right: 12
    });
  }

  mudar() {
    this.menuAparecer = !this.menuAparecer;
  }

  openModal() {
    //this.mudar();
    const modalRef = this.modalService.open(ModalUserComponent, { backdrop: "static", size: "lg" });
    modalRef.componentInstance.view = 'GERENCIAR';
  }

  openModalEditar() {
    //this.mudar();
  }

  openSettings() {
    //this.mudar();
    const modalRef = this.modalService.open(ModalSettings, { size: "lg" });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  onResize(event) {
    if (event.target.innerWidth > 890) {
      this.menuAparecer = false;
    }
  }
}
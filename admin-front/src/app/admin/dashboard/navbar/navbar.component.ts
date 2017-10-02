import { Component, OnInit, NgZone } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../servicos/auth.service';
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

  }
  openModalEditar(){

  }

  logout(){
    console.log("aqui");
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}

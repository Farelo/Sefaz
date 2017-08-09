import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
// @Input() aparecerLista;
// @Input() aparecerAdd;

private aparecerLista: boolean = true;
private aparecerAdd: boolean = false;
private perfil: any;
usuarios: any[] = [
  {nome: 'David', perfil: 'Operador Logístico'},
  {nome: 'Samuel', perfil: 'Funcionário'},
  {nome: 'Maysa', perfil: 'Operador Logístico'},
  {nome: 'Sarah', perfil: 'Fornecedor'},
];

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    // private modalOptions: NgbModalOptions
  ) { }

  ngOnInit() {
  }

  openAdd(){
      this.aparecerLista = false;
      this.aparecerAdd = true;
      // this.modalOptions.backdrop = 'static';
      // this.modalOptions.keyboard(false);
  }
  closeAdd(){
      this.aparecerLista = true;
      this.aparecerAdd = false;
      this.perfil ="";
  }
  adicionarUsuario(){

  }

}

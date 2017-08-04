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

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }

  openAdd(){
      this.aparecerLista = false;
      this.aparecerAdd = true;
  }


}

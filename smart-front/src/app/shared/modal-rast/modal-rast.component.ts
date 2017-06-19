import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { EmbalagensService } from '../../servicos/embalagens.service';

@Component({
  selector: 'app-modal-rast',
  templateUrl: './modal-rast.component.html',
  styleUrls: ['./modal-rast.component.css']
})
export class ModalRastComponent implements OnInit {
@Input() setor;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private embalagensService: EmbalagensService,
    private router: Router
  ) { }

  ngOnInit() {
  }

}

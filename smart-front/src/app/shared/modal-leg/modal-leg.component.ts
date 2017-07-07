import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { EmbalagensService } from '../../servicos/embalagens.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-leg.component.html',
  styleUrls: ['./modal-leg.component.css']
})
export class ModalLegComponent implements OnInit {
@Input() embalagem;
//embalagem: any;

inscricao: Subscription;
  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private embalagensService: EmbalagensService,
    private router: Router) { }

  ngOnInit() {

  }


}

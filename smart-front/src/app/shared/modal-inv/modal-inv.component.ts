import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';



@Component({
  selector: 'app-modal-inv',
  templateUrl: './modal-inv.component.html',
  styleUrls: ['./modal-inv.component.css']
})
export class ModalInvComponent implements OnInit {
// @Input() alerta;

inscricao: Subscription;
  constructor(
    public activeAlerta: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
  }

}

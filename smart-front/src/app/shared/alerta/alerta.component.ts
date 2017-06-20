import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { EmbalagensService } from '../../servicos/embalagens.service';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaComponent implements OnInit {
@Input() alerta;

inscricao: Subscription;
  constructor(
    public activeAlerta: NgbActiveModal,
    private route: ActivatedRoute,
    private embalagensService: EmbalagensService,
    private router: Router) { }

  ngOnInit() {
  }

}

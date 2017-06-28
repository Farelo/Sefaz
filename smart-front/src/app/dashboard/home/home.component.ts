import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../servicos/alerts.service'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Alert } from '../../shared/models/alert';
import { Subscription } from 'rxjs/Rx';
declare var $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  inscricao: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit() {

      $('.edit').css({'background-color':'red'});
    
  }
  funcaoTop(){
    $('.edit').css({'background-color':'red'});
  }
}

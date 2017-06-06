import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmbalagensService } from '../servicos/embalagens.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  embalagens: any[];
  embalagem: any;
  inscricao: Subscription;

  constructor(
    private route: ActivatedRoute,
    private embalagensService: EmbalagensService,
    private router: Router
  ) { }

  ngOnInit() {
    this.embalagens = this.embalagensService.getEmbalagens();
    /*this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params ['id'];

        this.embalagem = this.embalagensService.getEmbalagem(id);
      }
    )*/
  }
  /*verEmbalagem(id:number){
    this.router.navigate(['/alunos',this.embalagem.id]);
  }*/
  /*ngOnDestroy () {
    this.inscricao.unsubscribe();
  }*/
}

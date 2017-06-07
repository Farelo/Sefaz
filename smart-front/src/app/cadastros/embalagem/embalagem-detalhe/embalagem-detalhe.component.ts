import { Component, OnInit, Input } from '@angular/core';
import { EmbalagensService } from '../../../servicos/embalagens.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-embalagem-detalhe',
  templateUrl: './embalagem-detalhe.component.html',
  styleUrls: ['./embalagem-detalhe.component.css']
})
export class EmbalagemDetalheComponent implements OnInit {
  embalagens: any[]
  embalagem: any;
  inscricao: Subscription;

  constructor(
      private embalagensService: EmbalagensService,
      private router: Router,
        private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.embalagens = this.embalagensService.getEmbalagens();
    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params ['id'];

        this.embalagem = this.embalagensService.getEmbalagem(id);
      }
    )
  }
  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }
}

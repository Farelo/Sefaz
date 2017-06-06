import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { EmbalagensService } from '../../servicos/embalagens.service';


@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.component.html',
  styleUrls: ['./detalhe.component.css']
})
export class DetalheComponent implements OnInit {

  embalagem: any;
  inscricao: Subscription;
    constructor(
      public activeModal: NgbActiveModal,
      private route: ActivatedRoute,
      private embalagensService: EmbalagensService,
      private router: Router
    ) { }

    ngOnInit() {
      this.inscricao = this.route.params.subscribe(
        (params: any)=>{
          let id = params ['id'];

          this.embalagem = this.embalagensService.getEmbalagem(id);
        }
      )
    }
    verEmbalagem(){
      this.router.navigate(['/alunos',this.embalagem.id]);
    }
    ngOnDestroy () {
      this.inscricao.unsubscribe();
    }

}

import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmbalagensService } from '../../servicos/embalagens.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { ModalComponent } from '../../shared/modal/modal.component';


@Component({
  selector: 'lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  embalagens: any[]
  embalagem: any;
  lista: any[]
  inscricao: Subscription;

  constructor(
    private embalagensService: EmbalagensService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal

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
  open(embalagem) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.embalagem = embalagem;
  }

}

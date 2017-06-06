import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmbalagensService } from '../../servicos/embalagens.service';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'timeline',
  templateUrl: './home-timeline.component.html',
  styleUrls: ['./home-timeline.component.css']
})
export class HomeTimelineComponent implements OnInit {

  embalagens: any[];
  embalagem: any;
  constructor(
    private embalagensService: EmbalagensService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.embalagens = this.embalagensService.getEmbalagens();
  }
  open(embalagem) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.embalagem = embalagem;
  }
}

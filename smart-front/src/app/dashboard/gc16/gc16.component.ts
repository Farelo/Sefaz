import { Component, OnInit } from '@angular/core';
import { GC16Service } from '../../servicos/gc16.service';
import { Pagination } from '../../shared/models/pagination';
import { ModalDeleteComponent } from '../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gc16',
  templateUrl: './gc16.component.html',
  styleUrls: ['./gc16.component.css']
})
export class Gc16Component implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search  = "";
  constructor(
    private GC16Service: GC16Service,
    private modalService: NgbModal
  ) { }

  searchEvent(): void{
      this.loadGC16();
  }

  loadGC16() {
    this.GC16Service
      .getGC16sPagination(10, this.data.meta.page ,this.search)
      .subscribe(result => {
         this.data = result;
       },err => {  console.log(err)});
  }

  //refazer isso daqui, depende de muitas coisas para ser realizada a alteração
  removeGC16(object: any):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = object;
    modalRef.componentInstance.type = "gc16";

    modalRef.result.then((result) => {
      if(result === "remove") this.loadGC16();
    });
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadGC16();
  }

  ngOnInit() {
    this.loadGC16();
  }

}

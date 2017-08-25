import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PackingService } from '../../../servicos/packings.service';
import { Packing } from '../../../shared/models/Packing';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-embalagem',
  templateUrl: './embalagem.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class EmbalagemComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search : string;

  constructor(
    private PackingService : PackingService,
    private modalService: NgbModal
  ) { }

  searchEvent(): void{
    if(this.search != "" && this.search){
      this.PackingService.getPackingsPaginationByAttr(10,this.data.meta.page,this.search)
        .subscribe(result => this.data = result, err => {console.log(err)});
    }else{
      this.loadPackings();
    }
  }

  loadPackings(): void{
    this.PackingService.getPackingsPagination(10,this.data.meta.page)
      .subscribe(result => this.data = result, err => {console.log(err)});
  }

  removePacking(id):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = id;
    modalRef.componentInstance.type = "packing";
    // this.PackingService.deletePacking(id).subscribe(result =>   this.loadPackings(), err => {console.log(err)})
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadPackings();
  }

  ngOnInit() {
    this.loadPackings();
  }

}

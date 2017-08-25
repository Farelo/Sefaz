import { Component, OnInit } from '@angular/core';
import { TagsService } from '../../../servicos/tags.service';;
import { Tag } from '../../../shared/models/Tag';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
    styleUrls: ['../cadastros.component.css']
})
export class TagsComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search : string;

  constructor(
    private TagsService: TagsService,
    private modalService: NgbModal
  ) { }

  searchEvent(): void{
    if(this.search != "" && this.search){
      // this.PackingService.getPackingsPaginationByAttr(10,this.data.meta.page,this.search)
      //   .subscribe(result => this.data = result, err => {console.log(err)});
    }else{
      this.loadTags();
    }
  }

  loadTags(){
    this.TagsService.getTagsPagination(10, this.data.meta.page)
      .subscribe(data => this.data = data,err => console.log(err));
  }

  removeTags(id):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = id;
    modalRef.componentInstance.type = "tag";
    // this.TagsService.deleteTag(id).subscribe(result =>   this.loadTags(), err => {console.log(err)})
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadTags();
  }

  ngOnInit() {
    // Load comments
    this.loadTags()
  }

}

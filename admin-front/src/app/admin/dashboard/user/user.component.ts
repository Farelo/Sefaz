import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { UserService } from '../../../servicos/user.service';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search  = "";
  constructor(
    private modalService: NgbModal,
    private userService: UserService
  ) { }

  searchEvent(): void{
      this.loadUsers();
  }

  loadUsers() {
    // Get all comments
    this.userService.getUserPagination(10, this.data.meta.page ,this.search)
      .subscribe(result => this.data = result,err => {  console.log(err)});
  }

  removeUser(object: any):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = object;
    modalRef.componentInstance.type = "user";

    modalRef.result.then((result) => {
      if(result === "remove") this.loadUsers();
    });
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadUsers();
  }

  ngOnInit() {
    this.loadUsers();
  }

}

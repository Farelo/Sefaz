import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../../servicos/index.service';;
import { Route } from '../../../shared/models/route';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rotas',
  templateUrl: './rotas.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class RotasComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search = "";
  constructor(
    private RoutesService : RoutesService,
    private modalService: NgbModal
  ) { }

  searchEvent(): void{
      this.loadRoutes();
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadRoutes();
  }

  loadRoutes(){

    this.RoutesService
      .getRoutesPagination(10,this.data.meta.page,this.search)
      .subscribe(data => {
        this.data = data;
      }, err => {console.log(err)});
  }

  removeRoutes(route):void{
    //MOSTRAR
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = route;
    modalRef.componentInstance.type = "route";

    modalRef.result.then((result) => {
      if(result === "remove") this.loadRoutes();
    });
  }

  ngOnInit() {

    this.loadRoutes();
  }

}

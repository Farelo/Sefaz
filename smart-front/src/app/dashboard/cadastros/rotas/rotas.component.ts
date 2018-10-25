import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../../servicos/index.service';;
import { Route } from '../../../shared/models/route';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DirectionsRenderer } from '@ngui/map';

@Component({
  selector: 'app-rotas',
  templateUrl: './rotas.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class RotasComponent implements OnInit {

  public allRoutes: Pagination = new Pagination({meta: {page : 1}});
  public search = "";

  constructor(
    private routesService : RoutesService,
    private modalService: NgbModal) { }

  searchEvent(): void{
      this.loadRoutes();
  }

  loadRoutes(){

    this.routesService
      .getAllRoutes()
      .subscribe(data => {
        
        this.allRoutes = data;
      }, err => {console.log(err)});
  }

  removeRoutes(route):void{
    
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

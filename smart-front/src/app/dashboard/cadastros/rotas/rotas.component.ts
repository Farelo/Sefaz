import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../../servicos/index.service';;
import { Route } from '../../../shared/models/route';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DirectionsRenderer } from '@ngui/map';
import { MeterFormatter } from 'app/shared/pipes/meter_formatter';

@Component({
  selector: 'app-rotas',
  templateUrl: './rotas.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class RotasComponent implements OnInit {

  public allRoutes: any[] = [];
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
    modalRef.componentInstance.mObject = route;
    modalRef.componentInstance.mType = "ROUTE";


    modalRef.result.then((result) => {
      this.loadRoutes();
    });
  }

  getFormatedDistance(value: number){
    return (new MeterFormatter()).to(value/1000);
  }

  ngOnInit() {

    this.loadRoutes();
  }

}

import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../../servicos/routes.service';;
import { Route } from '../../../shared/models/route';
import { Pagination } from '../../../shared/models/pagination';

@Component({
  selector: 'app-rotas',
  templateUrl: './rotas.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class RotasComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search : string;
  constructor(private RoutesService : RoutesService) { }

  searchEvent(): void{
    if(this.search != "" && this.search){
      // this.PackingService.getPackingsPaginationByAttr(10,this.data.meta.page,this.search)
      //   .subscribe(result => this.data = result, err => {console.log(err)});
    }else{
      this.loadRoutes();
    }
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadRoutes();
  }

  loadRoutes(){
    this.RoutesService.getRoutesPagination(10,1)
      .subscribe(data => this.data = data, err => {console.log(err)});
  }

  removeRoutes(id):void{
    this.RoutesService.deleteRoute(id).subscribe(result =>   this.loadRoutes(), err => {console.log(err)})
  }

  ngOnInit() {

    this.loadRoutes();
  }

}

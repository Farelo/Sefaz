import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../servicos/routes.service';;
import { Route } from '../../shared/models/route';

@Component({
  selector: 'app-rotas',
  templateUrl: './rotas.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class RotasComponent implements OnInit {

  constructor(private RoutesService : RoutesService) { }
routes : Route [];
  vazio: boolean = false;


loadRoutes(){
  this.RoutesService.getRoutesPagination(10,1)
    .subscribe(routes => this.routes = routes, err => {console.log(err)});
}
ngOnInit() {

  this.loadRoutes();
}

}

import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../../servicos/packings.service';;
import { Packing } from '../../../shared/models/packing';
import { SuppliersService } from '../../../servicos/suppliers.service';
import { Supplier } from '../../../shared/models/supplier';
import { PlantsService } from '../../../servicos/plants.service';
import { RoutesService } from '../../../servicos/routes.service';;
import { Route } from '../../../shared/models/route';
import { Router } from '@angular/router';


@Component({
  selector: 'app-rotas-cadastrar',
  templateUrl: './rotas-cadastrar.component.html',
  styleUrls: ['./rotas-cadastrar.component.css']
})
export class RotasCadastrarComponent implements OnInit {
  time: any;

  constructor(
    private PlantsService: PlantsService,
    private PackingService: PackingService,
    private SuppliersService: SuppliersService,
    private RoutesService: RoutesService,
    private router: Router
  ) { }

  plants =  [];
  packings = [];
  supplier : Supplier = new Supplier();
  route : Route = new Route();


  registerRoute():void {

    try {
      // this.route.packing_code = this.route.packing_code.code;
      // this.route.supplier = this.route.supplier._id;
      // this.route.plant_supplier = this.route.supplier.plant._id;
      // this.route.hashPacking =  this.supplier._id + this.route.packing_code;
      // this.route.estimeted_time = (this.route.date_estimated.getHours() * (60000 * 60)) + (this.route.date_estimated.getMinutes() * 60000);

      this.RoutesService.createRoute(this.route)
      .subscribe( result => this.PackingService.updateAllPacking(this.route.packing_code,this.supplier._id , new Packing({"hashPacking": this.route.hashPacking}))
      .subscribe(result => this.router.navigate(['/cadastros/embalagem'])) );
   } catch (e) {

   }

  }

  loadPlants():void {
    this.PlantsService.retrieveAll().subscribe( result => this.plants = result );
  }

  loadPackings():void {
    this.PackingService.retrieveAllNoBinded().subscribe( result => this.packings = result );
  }

  loadSupplier(id):void {
    this.SuppliersService.retrieveSupplier(id).subscribe( result => this.supplier = result );
  }

  ngOnInit() {
    console.log(this.route);
    this.loadPlants();
    this.loadPackings();
  }

}

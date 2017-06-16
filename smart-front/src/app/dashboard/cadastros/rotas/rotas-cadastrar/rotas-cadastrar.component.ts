import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../../../servicos/packings.service';;
import { Packing } from '../../../../shared/models/packing';
import { SuppliersService } from '../../../../servicos/suppliers.service';
import { Supplier } from '../../../../shared/models/supplier';
import { PlantsService } from '../../../../servicos/plants.service';
import { RoutesService } from '../../../../servicos/routes.service';;
import { Route } from '../../../../shared/models/route';
import { Router } from '@angular/router';


@Component({
  selector: 'app-rotas-cadastrar',
  templateUrl: './rotas-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
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
  route : Route = new Route({packing_code:"",plant_factory:""});
  packing: Route = new Route({packing_code:""});
  plant_supplier: any;
  supplier_packing: any;
  choiced = false;

  registerRoute():void {


      this.route.hashPacking =  this.route.supplier + this.route.packing_code;
      this.route.estimeted_time = (this.route.date_estimated.hour * (60000 * 60)) + (this.route.date_estimated.minute * 60000);


      this.RoutesService.createRoute(this.route)
      .subscribe( result => this.PackingService.updateAllPacking(this.route.packing_code,this.route.supplier , new Packing({"hashPacking": this.route.hashPacking}))
      .subscribe(result => this.router.navigate(['/rc/cadastros/rotas'])) );


  }

  loadPlants():void {
    this.PlantsService.retrieveAll().subscribe( result => this.plants = result );
  }

  loadPackings():void {
    this.PackingService.retrieveAllNoBinded().subscribe( result => this.packings = result );
  }

  //try to otimizate this (ugly)
  loadSupplier(event):void {
    console.log(event);
    if(event != ""){
      this.choiced = true;
      this.route.packing_code = event._id.code;
      this.SuppliersService.retrieveSupplier( event._id.supplier).subscribe( result => {
        this.supplier_packing = result.name;
        this.plant_supplier = result.plant;
        this.route.supplier = result._id;
        this.route.plant_supplier = this.plant_supplier._id;
        this.plant_supplier = this.plant_supplier.name;
      });
    }else{
      this.choiced = false;
    }

  }

  ngOnInit() {

    this.loadPlants();
    this.loadPackings();
  }

}

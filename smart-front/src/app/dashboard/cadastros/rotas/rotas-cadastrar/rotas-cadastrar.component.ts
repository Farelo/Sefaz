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
    private suppliersService: SuppliersService,
    private RoutesService: RoutesService,
    private router: Router
  ) { }

  plants =  [];
  packings = [];
  public suppliers :any;
  supplier : Supplier = new Supplier();
  route : Route = new Route({packing_code:"",plant_factory:""});
  packing: Route = new Route({packing_code:""});
  plant_supplier: any;
  supplier_packing: any;
  choiced = false;
  choice_equipament = false;

  registerRoute():void {


      this.route.hashPacking =  this.route.supplier + this.route.packing_code;
      this.route.estimeted_time = (this.route.date_estimated.hour * (60000 * 60)) + (this.route.date_estimated.minute * 60000);


      this.RoutesService.createRoute(this.route)
      .subscribe( result => this.PackingService.updateAllPacking(this.route.packing_code,this.route.supplier , new Packing({"hashPacking": this.route.hashPacking}))
      .subscribe(result => this.router.navigate(['/rc/cadastros/rotas'])) );


  }

  onChange(event:any){
    console.log(event);
    if(event){
      this.choice_equipament = true;
      this.supplier = event.supplier;
    }


  }

  loadPlants():void {
    this.PlantsService.retrieveAll().subscribe( result => this.plants = result );
  }

  loadPackings(event):void {
    if(event){
      this.choice_equipament = false;
      this.PackingService.retrieveAllNoBinded(event.value).subscribe( result => {
        this.choiced = true;
        if(result.data.length === 0)  this.choiced = false;
        else this.packings = result;
        } );
    }else{
      this.choiced = false;
    }

  }

  loadSuppliers():void{

    this.suppliersService.retrieveAll().subscribe(result => {
      this.suppliers = result;
    }, err => {console.log(err)});
  }


  ngOnInit() {

    this.loadPlants();
    this.loadSuppliers();
  }

}

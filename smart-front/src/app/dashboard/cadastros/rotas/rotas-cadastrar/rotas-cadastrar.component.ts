import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { PackingService } from '../../../../servicos/packings.service';;
import { Packing } from '../../../../shared/models/packing';
import { SuppliersService } from '../../../../servicos/suppliers.service';
import { Supplier } from '../../../../shared/models/supplier';
import { PlantsService } from '../../../../servicos/plants.service';
import { RoutesService } from '../../../../servicos/routes.service';;
import { Route } from '../../../../shared/models/route';
import { Router } from '@angular/router';
import { DirectionsRenderer } from '@ngui/map';
import { ToastService } from '../../../../servicos/toast.service';

@Component({
  selector: 'app-rotas-cadastrar',
  templateUrl: './rotas-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class RotasCadastrarComponent implements OnInit {
  @ViewChild(DirectionsRenderer) directionsRendererDirective: DirectionsRenderer;

  directionsRenderer: google.maps.DirectionsRenderer;
  directionsResult: google.maps.DirectionsResult;

  direction: any = {
    origin: '',
    destination:'',
    travelMode: 'DRIVING'
  };

  constructor(
    private PlantsService: PlantsService,
    private PackingService: PackingService,
    private suppliersService: SuppliersService,
    private RoutesService: RoutesService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private toastService: ToastService
  ) { }

  plants =  [];
  packings = [];
  public suppliers :any;
  supplier : Supplier = new Supplier();
  route : Route = new Route({packing_code:"",plant_factory:"", location: { distance: "", duration: "", start_address: "", end_address: ""}});
  packing: Route = new Route({packing_code:""});
  plant_supplier: any;
  supplier_packing: any;
  choiced = false;
  choice_equipament = false;
  partial_element = '';
  autocomplete: any;
  address: any = {};
  center: any;
  pos : any;
  directions = false;
  plant_factory : any = "";




  registerRoute():void {


      this.route.hashPacking =  this.route.supplier + this.route.packing_code;
      this.route.plant_factory = this.plant_factory._id;


      this.RoutesService.createRoute(this.route)
        .subscribe( result =>  this.PackingService.updateAllPacking(result.data.packing_code,result.data.supplier , new Packing({"hashPacking": result.data.hashPacking, "route": result.data._id}))
        .subscribe(result => this.toastService.success('/rc/cadastros/rotas', 'Rota'), err => this.toastService.error(err)));


  }

  directionsChanged() {
    this.directionsResult = this.directionsRenderer.getDirections();
    if(this.directionsResult){
      this.directions =  true;
      this.route.location.distance = this.directionsResult.routes[0].legs[0].distance;
      this.route.location.duration = this.directionsResult.routes[0].legs[0].duration;
      this.route.location.start_address = this.directionsResult.routes[0].legs[0].start_address;
      this.route.location.end_address = this.directionsResult.routes[0].legs[0].end_address;
    }else{
      this.directions =  false;
    }
    this.ref.detectChanges();
  }

  showDirection() {

    this.directionsRendererDirective['showDirections'](this.direction);
  }

  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }



  onMapReady(map) {
    // this.direction.origin = map.getCenter();

  }

  onChangeFactory(event:any){

    if(event){

        this.direction.origin  = new google.maps.LatLng(event.lat, event.lng);
        this.showDirection();

    }
  }

  onChangeSupplier(event:any){
    if(event){
      this.choice_equipament = true;
      this.route.packing_code = event.id;
      this.route.plant_supplier = event.supplier.plant;
      this.route.supplier = event.supplier._id;
      this.direction.destination  = new google.maps.LatLng(event.plant.lat, event.plant.lng);
      this.showDirection();
    }else{
        this.choice_equipament = false;
    }
  }

  loadPlants():void {
    this.PlantsService.retrieveAll().subscribe( result => this.plants = result );
  }

  loadPackings(event):void {
    if(event){
      this.choice_equipament = false;
      this.PackingService.retrieveAllNoBinded(event.value).subscribe( result => {

        if(result.data.length === 0){
          this.choiced = false;
          this.packings  = [];
        }
        else {
          this.choiced = true;
          this.packings = result.data;
        }
      });
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
    this.directionsRendererDirective['initialized$'].subscribe( directionsRenderer => {
      this.directionsRenderer = directionsRenderer;
    });
    this.loadPlants();
    this.loadSuppliers();
  }

}

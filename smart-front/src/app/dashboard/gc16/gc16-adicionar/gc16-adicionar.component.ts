import { Component, OnInit } from '@angular/core';
import { GC16 } from '../../../shared/models/gc16';
import { Project } from '../../../shared/models/project';
import { SuppliersService } from '../../../servicos/suppliers.service';
import { Supplier } from '../../../shared/models/supplier';
import { PackingService } from '../../../servicos/packings.service';
import { ProjectService } from '../../../servicos/projects.service';
import { GC16Service } from '../../../servicos/gc16.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-gc16-adicionar',
  templateUrl: './gc16-adicionar.component.html',
  styleUrls: ['./gc16-adicionar.component.css']
})

export class Gc16AdicionarComponent implements OnInit {
  public gc16:  GC16;
  public suppliers : Supplier [];
  public packings : any [];
  public project : Project;
  public selectedItem = "";
  public selectedProject = "";

  constructor(
    private suppliersService: SuppliersService,
    private packingService: PackingService,
    private projectService: ProjectService,
    private GC16Service: GC16Service,
    private router: Router
  ) {
    this.project = new Project();
    this.gc16 = new GC16({factoryStock: {}, supplierStock: {}, transportationGoing: {}, transportantionBack: {}, secutiryFactor: {}, frequency: {}});
  }


  finish(){

    this.gc16.project =  this.project._id;

    this.GC16Service.createGC16(this.gc16)
                    .subscribe(result => this.packingService.updatePackingByCode(this.gc16.packing,{gc16: result._id})
                    .subscribe(result => this.router.navigate(['/rc/gc16'])));

  }

  onBlurMethod(){


    if(this.gc16.capacity && this.gc16.annualVolume && this.gc16.productiveDays){
      this.gc16.containerDays = Math.floor(((this.gc16.annualVolume/this.gc16.productiveDays)/this.gc16.capacity));
    }
    //setting Initializate
    if(this.gc16.factoryStock.days && this.gc16.supplierStock.days && this.gc16.transportationGoing.days && this.gc16.transportantionBack.days && this.gc16.frequency.days){
      this.gc16.frequency.QuantTotalDays = (this.gc16.factoryStock.days + this.gc16.supplierStock.days + this.gc16.transportationGoing.days + this.gc16.transportantionBack.days) + (2 * this.gc16.frequency.days);
      if(this.gc16.containerDays && this.gc16.frequency.QuantTotalDays && this.gc16.secutiryFactor.percentage){
        //secutiryFactor
        this.gc16.secutiryFactor.QuantTotalBuilt = Math.ceil(((((1 + (this.gc16.secutiryFactor.percentage/100))*this.gc16.containerDays)*this.gc16.frequency.QuantTotalDays)));
        this.gc16.secutiryFactor.QuantContainer = Math.ceil(((this.gc16.secutiryFactor.percentage*this.gc16.secutiryFactor.QuantTotalBuilt)/100));
        //Frequencia
        this.gc16.frequency.fr = Math.floor(((this.gc16.frequency.days/this.gc16.frequency.QuantTotalDays)*100));
        this.gc16.frequency.QuantContainer = Math.floor(((this.gc16.frequency.fr/100)*this.gc16.secutiryFactor.QuantTotalBuilt));
        //Estoque da Fábrica
        this.gc16.factoryStock.fs = Math.floor(((this.gc16.factoryStock.days/this.gc16.frequency.QuantTotalDays)*100));
        this.gc16.factoryStock.QuantContainerfs = Math.floor(((this.gc16.factoryStock.fs/100)*this.gc16.secutiryFactor.QuantTotalBuilt));
        this.gc16.factoryStock.QuantContainerfsMax = (this.gc16.factoryStock.QuantContainerfs + this.gc16.frequency.QuantContainer);
        this.gc16.factoryStock.fsMax = (this.gc16.factoryStock.fs + this.gc16.frequency.fr);
        //Estoque do Fornecedor
        this.gc16.supplierStock.ss = Math.floor(((this.gc16.supplierStock.days/this.gc16.frequency.QuantTotalDays)*100));
        this.gc16.supplierStock.QuantContainerSs = Math.floor(((this.gc16.supplierStock.ss/100)*this.gc16.secutiryFactor.QuantTotalBuilt));
        this.gc16.supplierStock.QuantContainerSsMax = (this.gc16.supplierStock.QuantContainerSs + this.gc16.frequency.QuantContainer);
        this.gc16.supplierStock.ssMax = (this.gc16.supplierStock.ss + this.gc16.frequency.fr);
        //Transport Ida
        this.gc16.transportationGoing.tg = Math.floor(((this.gc16.transportationGoing.days/this.gc16.frequency.QuantTotalDays)*100));
        this.gc16.transportationGoing.QuantContainerTg = Math.floor(((this.gc16.transportationGoing.tg/100)*this.gc16.secutiryFactor.QuantTotalBuilt));
        //Transport Volta
        this.gc16.transportantionBack.tb = Math.floor(((this.gc16.transportantionBack.days/this.gc16.frequency.QuantTotalDays)*100));
        this.gc16.transportantionBack.QuantContainerTb = Math.floor(((this.gc16.transportantionBack.tb/100)*this.gc16.secutiryFactor.QuantTotalBuilt));

      }
    }

  }

  loadPackings(event: any):void{
    this.project = new Project();
    this.selectedProject = "";
    if(event){
      this.gc16.supplier = event._id;
      this.packingService.getBySupplier(event._id).subscribe(packings => this.packings = packings, err => {console.log(err)});
    }
  }

  loadProject(event: any):void{
    if(event){
      this.gc16.packing = event.packing;
      this.projectService.retrieveProject(event.project).subscribe(project => this.project = project, err => {console.log(err)});
    }
  }

  loadSuppliers():void{
    this.suppliersService.retrieveAll().subscribe(suppliers => this.suppliers = suppliers, err => {console.log(err)});
  }

  ngOnInit() {
      this.loadSuppliers();
  }

}

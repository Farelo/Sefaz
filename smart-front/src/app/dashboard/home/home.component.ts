  import { Component, OnInit } from '@angular/core';
  import { PackingService } from '../../servicos/index.service';
  import { Pagination } from '../../shared/models/pagination';
  import { ModalDeleteComponent } from '../../shared/modal-delete/modal-delete.component';
  import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

  @Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
  })
  export class HomeComponent implements OnInit {
    public packingsPerPlant: Pagination = new Pagination({meta: {page : 1}});
    public packingsPerCondition: Pagination = new Pagination({meta: {page : 1}});
    public search  = "";
    public colorScheme = {  
      domain: ['#666', '#ef5562', '#f77737', '#4c7bff', '#4dc9ff', '#9f8cc1' ]
    };
    
    // pie
    public showLabels = true;
    public explodeSlices = false;
    public doughnut = false;
    public showLegend = true;

    constructor(
      private packingService: PackingService,
    ) { }

    searchEvent(): void{
      
    }

    loadPackingPerPlant() {
      this.packingService
        .loadingPackingPerPlant(10, this.packingsPerPlant.meta.page )
        .subscribe(result => {
          this.packingsPerPlant = result;
        },err => {  console.log(err)});
    }

    loadPackingPerCondition() {
      this.packingService
        .loadingPackingPerCondition( )
        .subscribe(result => {
          this.packingsPerCondition = result;
        },err => {  console.log(err)});
    }

    

    pageChanged(page: any): void{
      this.packingsPerPlant.meta.page = page;
    }

    ngOnInit() {
      this.loadPackingPerPlant()
      this.loadPackingPerCondition()
    }

  }

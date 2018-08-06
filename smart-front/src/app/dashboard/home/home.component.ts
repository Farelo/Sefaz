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
      domain: ['#666666', '#ef5562', '#f77737', '#027f01', '#4c7bff', '#4dc9ff' ]
    };

    // pie
    public showLabels = true;
    public explodeSlices = false;
    public doughnut = false;
    public showLegend = true;

    constructor(
      private packingService: PackingService
    ) { }

    searchEvent(): void{
      
    }

    loadPackingPerPlant() {
      this.packingService
        .loadingPackingPerPlant(10, this.packingsPerPlant.meta.page )
        .subscribe(result => {
          this.packingsPerPlant = result;

          console.log('[this.packingsPerPlant]: ' + JSON.stringify(result));
        },err => {  console.log(err)});
    }

    loadPackingPerCondition() {
      this.packingService
        .loadingPackingPerCondition( )
        .subscribe(result => {
          //console.log('[this.packingsPerCondition]: ' + JSON.stringify(result));

          this.packingsPerCondition = result;
          this.getPackingSum();
        },err => {  console.log(err)});
    }

    

    pageChanged(page: any): void{
      this.packingsPerPlant.meta.page = page;
    }

    ngOnInit() {
      this.loadPackingPerPlant();
      this.loadPackingPerCondition();
    }

    /**
     * Misc methods
     */
    private packingSum: number = 0;
    getPackingSum(){

      if (this.packingsPerCondition.data != undefined) {
        this.packingSum = this.packingsPerCondition.data.reduce((sum, elem)=> sum + elem.value, 0);
      }

      return this.packingSum;
    }

    getSumByCondition(i: number){
      let result = 0;
      
      if (this.packingsPerCondition.data != undefined){
        result = this.packingsPerCondition.data[i].value;
      }

      return result;
    }

  }

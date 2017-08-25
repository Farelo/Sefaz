import { Component, OnInit } from '@angular/core';
import { PlantsService } from '../../../servicos/plants.service';;
import { Plant } from '../../../shared/models/Plant';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-planta',
  templateUrl: './planta.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class PlantaComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search : string;
  constructor(
    private PlantsService : PlantsService,
    private modalService: NgbModal
  ) {  }

  searchEvent(): void{
    if(this.search != "" && this.search){
      // this.PackingService.getPackingsPaginationByAttr(10,this.data.meta.page,this.search)
      //   .subscribe(result => this.data = result, err => {console.log(err)});
    }else{
      this.loadPlants();
    }
  }

  loadPlants(){
    this.PlantsService.getPlantsPagination(10,this.data.meta.page)
      .subscribe( data => this.data = data, err => {console.log(err)});
  }

  removePlant(id):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = id;
    modalRef.componentInstance.type = "plant";
    //this.PlantsService.deletePlant(id).subscribe(result =>   this.loadPlants(), err => {console.log(err)})
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadPlants();
  }

  ngOnInit() {
    this.loadPlants();
  }

}

import { Component, OnInit } from '@angular/core';
import { PlantsService } from '../../../../servicos/plants.service';;
import { Plant } from '../../../../shared/models/Plant';
import { Pagination } from '../../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-planta',
  templateUrl: './planta.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class PlantaComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search  = "";
  constructor(
    private PlantsService : PlantsService,
    private modalService: NgbModal
  ) {  }

  searchEvent(): void{
      this.loadPlants();
  }

  loadPlants(){
    this.PlantsService.getPlantsPagination(10,this.data.meta.page,this.search)
      .subscribe( data => this.data = data, err => {console.log(err)});
  }

  removePlant(plant):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = plant;
    modalRef.componentInstance.type = "plant";
    modalRef.result.then((result) => {
      if(result === "remove") this.loadPlants();
    });
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadPlants();
  }

  ngOnInit() {
    this.loadPlants();
  }

}

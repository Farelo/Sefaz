import { Component, OnInit } from '@angular/core';
import { PlantsService } from '../../../servicos/index.service';;
import { Plant } from '../../../shared/models/plant';
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
  public search  = "";

  public p: number = 1; //página atual

  constructor(
    private PlantsService : PlantsService,
    private modalService: NgbModal
  ) {  }

  searchEvent(): void{
      this.loadPlants();
  }

  loadPlants(){
    this.PlantsService
    // .getPlantsPagination(10,this.data.meta.page,this.search)
    .getPlantsPagination(99999999, this.data.meta.page, this.search)
      .subscribe( data => {
        this.data = data;
        this.data.data = this.customSort(this.data.data, ['code']);

      }, err => {console.log(err)});
  }

  removePlant(plant):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = plant;
    modalRef.componentInstance.type = "plant";
    modalRef.result.then((result) => {
      if(result === "remove") this.loadPlants();
    });
  }

  ngOnInit() {
    this.loadTableHeaders();
    this.loadPlants();
  }

  /**
   * Ordenação
   */
  public headers: any = [];
  public sortStatus: any = ['asc', 'desc'];
  public sort: any = {
    name: '',
    order: ''
  };

  loadTableHeaders() {
    this.headers.push({ label: 'Planta', name: 'plant_name' });
  }

  headerClick(item: any) {
    this.sort.name = item.name;
    this.sort.order = this.sortStatus[(this.sortStatus.indexOf(this.sort.order) + 1) % 2];

    console.log('---');
    console.log('this.sort: ' + JSON.stringify(this.sort));

    this.data.data = this.customSort(this.data.data, item.name.split("."), this.sort.order);
  }

  /**
   * 
   * @param array     All items.
   * @param keyArr    Array with attribute path, if exists.
   * @param reverse   optional. 1 if ascendent, -1 else.
   */
  customSort(array:any[], keyArr:any[], reverse='asc') {
    var sortOrder = 1;
    if (reverse == 'desc') sortOrder = -1;

    console.log('array.length: ' + array.length); 
    console.log('keyArr: ' + keyArr);
    console.log('sortOrder: ' + sortOrder);

    return array.sort(function (a, b) {
      var x = a, y = b;
      for (var i = 0; i < keyArr.length; i++) {
        x = x[keyArr[i]];
        y = y[keyArr[i]];
      }
      return sortOrder * ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

}

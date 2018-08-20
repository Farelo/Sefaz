import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { HomeService } from '../../../servicos/home.service';
import { Pagination } from '../../../shared/models/pagination';
import { InventoryService } from '../../../servicos/index.service';

@Component({
  selector: 'app-categoria-bateria-baixa',
  templateUrl: './categoria-bateria-baixa.component.html',
  styleUrls: ['../../../../hamburgers.css', './categoria-bateria-baixa.component.css']
})
export class CategoriaBateriaBaixaComponent implements OnInit {

  @Input() resume: any;
  public listBattery: Pagination = new Pagination({ meta: { page: 1, total_docs:0 } });
  public progressBateria: any = [];

  constructor(private homeService: HomeService, private inventoryService: InventoryService) { }

  ngOnInit() {
    
  }

  ngOnChanges() {
    //console.log(this.resume);
    this.getListIncorrectLocal();
  }

  getListIncorrectLocal() {
    this.inventoryService
      .getInventoryBattery(10, this.listBattery.meta.page, '', '').subscribe(result => {
        this.listBattery = result;

        console.log('this.listBattery: ' + JSON.stringify(this.listBattery));

        this.calculateProgress();

      },err => {console.log(err);});
  }

  calculateProgress() {
    if (this.resume.quantityTotal > 0) {
      //Categoria em pontos de controle
      this.progressBateria.push((parseFloat(this.resume.quantityBattery) / parseFloat(this.resume.quantityTotal)) * 100);
      this.progressBateria.push(100 - this.progressBateria[0]);

      console.log('this.progressBateria: ' + this.progressBateria);
      //console.log('this.progressEmViagem: ' + this.progressBateria);
    }
  }

  /*
   * Pagination
   */
  batteryChange() {
    console.log('batteryChange');
  }

}

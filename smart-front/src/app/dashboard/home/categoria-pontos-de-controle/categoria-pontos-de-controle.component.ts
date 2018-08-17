import { Component, OnInit, Input } from '@angular/core';
import { HomeService } from '../../../servicos/home.service';
import { Pagination } from '../../../shared/models/pagination';

@Component({
  selector: 'app-categoria-pontos-de-controle',
  templateUrl: './categoria-pontos-de-controle.component.html',
  styleUrls: ['./categoria-pontos-de-controle.component.css']
})
export class CategoriaPontosDeControleComponent implements OnInit {

  @Input() resume: any;

  public progressControle: any = []; 
  public listIncorrectLocal: Pagination = new Pagination({ meta: { page: 1 } });
  public listPermanenceTime: Pagination = new Pagination({ meta: { page: 1 } });
  
  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.getListIncorrectLocal();
    this.getListPermanenceTime();
  }

  ngOnChanges() {
    console.log('[ngOnChanges] resume: ' + JSON.stringify(this.resume));
    this.calculateProgress();
  }

  calculateProgress() {
    if (this.resume.quantityIncorrectLocal + this.resume.quantityTimeExceeded > 0) {
      //Categoria em pontos de controle
      this.progressControle.push((parseFloat(this.resume.quantityIncorrectLocal)/ parseFloat(this.resume.quantityIncorrectLocal + this.resume.quantityTimeExceeded)) * 100);
      this.progressControle.push((parseFloat(this.resume.quantityTimeExceeded) / parseFloat(this.resume.quantityIncorrectLocal + this.resume.quantityTimeExceeded)) * 100);
      this.progressControle.push(100 - this.progressControle[0] - this.progressControle[1]);

      console.log(this.progressControle);
    }
  }

  getListIncorrectLocal(){
    this.homeService.getStatusList(10, this.listIncorrectLocal.meta.page, 'INCORRECT_LOCAL').subscribe(result => {
      console.log('INCORRECT_LOCAL: ' + JSON.stringify(result));
      this.listIncorrectLocal = result;

    }, err => { console.log(err) });
  }

  getListPermanenceTime() {
    this.homeService.getStatusList(10, this.listIncorrectLocal.meta.page, 'PERMANENCE_EXCEEDED').subscribe(result => {
      console.log('PERMANENCE_EXCEEDED: ' + JSON.stringify(result));
      this.listPermanenceTime = result;

    }, err => { console.log(err) });
  }

  /*
  * Pagination
  */
  incorrectLocalChange(){
    console.log('incorrectLocal');
  }

  permanenceTimeChange(){
    console.log('permanenceTime');
  }
}


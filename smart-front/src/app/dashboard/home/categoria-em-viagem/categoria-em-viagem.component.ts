import { Component, OnInit, Input } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { HomeService } from '../../../servicos/home.service'; 

@Component({
  selector: 'app-categoria-em-viagem',
  templateUrl: './categoria-em-viagem.component.html',
  styleUrls: ['./categoria-em-viagem.component.css']
})
export class CategoriaEmViagemComponent implements OnInit {

  @Input() resume: any;

  public progressEmViagem: any = [];
  public listLate: Pagination = new Pagination({ meta: { page: 1 } });
  public listMissing: Pagination = new Pagination({ meta: { page: 1 } });
  
  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.getListLate();
    this.getListMissing();
  }

  ngOnChanges() {
    //console.log(this.resume);
    this.calculateProgress();
  }

  calculateProgress() {
    if (this.resume.quantityLate + this.resume.quantityMissing > 0) {
      //Categoria em pontos de controle
      this.progressEmViagem.push((parseFloat(this.resume.quantityLate) / parseFloat(this.resume.quantityTotal)) * 100);
      this.progressEmViagem.push((parseFloat(this.resume.quantityMissing) / parseFloat(this.resume.quantityTotal) * 100));
      this.progressEmViagem.push(100 - this.progressEmViagem[0] - this.progressEmViagem[1]);

      // this.progressEmViagem.push((parseFloat(this.resume.quantityLate) / parseFloat(this.resume.quantityLate + this.resume.quantityMissing) * 100));
      // this.progressEmViagem.push((parseFloat(this.resume.quantityMissing) / parseFloat(this.resume.quantityLate + this.resume.quantityMissing) * 100));
      // this.progressEmViagem.push(100 - this.progressEmViagem[0] - this.progressEmViagem[1]);

      //console.log('this.progressEmViagem: ' + this.progressEmViagem);
    }
  }

  getListLate() {
    this.homeService.getStatusList(10, this.listLate.meta.page, 'LATE').subscribe(result => {
      //console.log('LATE: ' + JSON.stringify(result));
      this.listLate = result;

    }, err => { console.log(err) });
  }

  getListMissing() {
    this.homeService.getStatusList(10, this.listMissing.meta.page, 'MISSING').subscribe(result => {
      //console.log('MISSING: ' + JSON.stringify(result));
      this.listMissing = result;

    }, err => { console.log(err) });
  }

  /*
   * Pagination
   */

  lateChange(){
    console.log('lateChange');
    this.getListLate();
  }

  missingChange(){
    console.log('lateChange');
    this.getListMissing();
  }

}
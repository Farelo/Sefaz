import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-categoria-pontos-de-controle',
  templateUrl: './categoria-pontos-de-controle.component.html',
  styleUrls: ['./categoria-pontos-de-controle.component.css']
})
export class CategoriaPontosDeControleComponent implements OnInit {

  @Input() resume: any;

  public progressControle: any = []; 

  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges() {
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

}


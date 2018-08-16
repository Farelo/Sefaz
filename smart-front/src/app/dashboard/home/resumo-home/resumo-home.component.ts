import { Component, OnInit, Input } from '@angular/core';
import { HomeService } from '../../../servicos/home.service';

@Component({
  selector: 'app-resumo-home',
  templateUrl: './resumo-home.component.html',
  styleUrls: ['./resumo-home.component.css']
})
export class ResumoHomeComponent implements OnInit {

  @Input()
  resume: any;

  public progressControle: any = [];
  public progressViagem: any = [];  
  public progressSemSinal: any = [];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(){
    this.calculateProgress();
  }

  calculateProgress(){
    if (this.resume.quantityTotal > 0){
      //Categoria em pontos de controle
      this.progressControle.push((parseFloat(this.resume.quantityIncorrectLocal + this.resume.quantityTimeExceeded) / parseFloat(this.resume.quantityTotal)) * 100);
      this.progressControle.push(100 - this.progressControle[0]);

      //Categoria em viagem
      this.progressViagem.push(this.progressControle[0]);
      this.progressViagem.push((parseFloat(this.resume.quantityLate + this.resume.quantityMissing + this.resume.quantityTraveling) / parseFloat(this.resume.quantityTotal))*100);
      this.progressViagem.push(100 - this.progressViagem[0] - this.progressViagem[1]);

      //Categoria sem sinal
    }
  }
}

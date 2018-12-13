import { Component, OnInit, Input } from '@angular/core';

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

  ngOnChanges() {
    this.calculateProgress();
  }

  calculateProgress() {
    
    if (this.resume.qtd_total > 0) {

      //Categoria em pontos de controle
      this.progressControle.push((parseFloat(this.resume.qtd_in_cp) / parseFloat(this.resume.qtd_total)) * 100);
      this.progressControle.push(100 - this.resume.qtd_in_cp);

      //Categoria em viagem
      this.progressViagem.push(parseFloat(this.resume.qtd_in_cp));
      this.progressViagem.push((parseFloat(this.resume.qtd_in_traveling) / parseFloat(this.resume.quantityTotal)) * 100);
      this.progressViagem.push(100 - this.resume.qtd_in_traveling);
    }
  }

  getTooltipControle(){
    return `${this.resume.qtd_in_cp} embalagens de ${this.resume.qtd_total}`;
  }

  getTooltipViagem() {
    return `${this.resume.qtd_in_traveling} embalagens de ${this.resume.qtd_total}`;
  }
}

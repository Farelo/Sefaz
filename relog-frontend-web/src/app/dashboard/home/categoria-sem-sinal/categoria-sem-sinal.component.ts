import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categoria-sem-sinal',
  templateUrl: './categoria-sem-sinal.component.html',
  styleUrls: ['./categoria-sem-sinal.component.css']
})
export class CategoriaSemSinalComponent implements OnInit {

  constructor(public translate: TranslateService) { 

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categoria-sem-sinal',
  templateUrl: './categoria-sem-sinal.component.html',
  styleUrls: ['./categoria-sem-sinal.component.css']
})
export class CategoriaSemSinalComponent implements OnInit {

  public semSinalCollapsed: boolean = false;
  public conteudoSemSinalCollapsed: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}

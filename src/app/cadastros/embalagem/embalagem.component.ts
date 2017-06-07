import { Component, OnInit } from '@angular/core';
import { EmbalagensService } from '../../servicos/embalagens.service';;

@Component({
  selector: 'app-embalagem',
  templateUrl: './embalagem.component.html',
  styleUrls: ['./embalagem.component.css']
})
export class EmbalagemComponent implements OnInit {
  embalagens: any[];

  constructor(
    private embalagensService: EmbalagensService
  ) { }

  ngOnInit() {
    this.embalagens = this.embalagensService.getEmbalagens();
  }

}

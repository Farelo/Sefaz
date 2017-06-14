import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../servicos/packings.service';
import { EmbalagensService } from '../../servicos/embalagens.service';;
import { Packing } from '../../shared/models/Packing';

@Component({
  selector: 'app-embalagem',
  templateUrl: './embalagem.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class EmbalagemComponent implements OnInit {
  embalagens: any[];
  vazio: boolean = false;

  constructor(
    private embalagensService : EmbalagensService,
    private PackingService : PackingService
  ) { }
    // ngOnInit() {
    //   this.embalagens = this.embalagensService.getEmbalagens();
    // }



  packings : Packing [];


  loadPackings(){
    this.PackingService.getPackingsPagination(10,1)
      .subscribe(packings => {this.packings = packings,
      console.log(this.packings)}, err => {console.log(err)});
  }

  ngOnInit() {
    this.loadPackings();
  }

}

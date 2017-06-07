import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../servicos/packings.service';;
import { Packing } from '../../shared/models/Packing';

@Component({
  selector: 'app-embalagem',
  templateUrl: './embalagem.component.html',
  styleUrls: ['./embalagem.component.css']
})
export class EmbalagemComponent implements OnInit {
  constructor(private PackingService : PackingService) { }

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

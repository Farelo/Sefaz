import { Component, OnInit } from '@angular/core';
import { EmbalagensService } from '../servicos/embalagens.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  embalagens: any[];

  constructor(
    private embalagensService: EmbalagensService
  ) { }

  ngOnInit() {
    this.embalagens = this.embalagensService.getEmbalagens();
  }

}

import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from '../../servicos/index.service';
import { Pagination } from '../../shared/models/pagination';


@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaModalComponent implements OnInit {
@Input() alerta;
public historicFlag = false;
public historic: Pagination = new Pagination({meta: {page : 1}})

  constructor(
    public activeAlerta: NgbActiveModal,
    private inventoryService: InventoryService,
    ) { }

  ngOnInit() {
    console.log(this.alerta);
  }

  getHistoric(){
    this.inventoryService.getInventoryPackingHistoric(10,this.historic.meta.page,this.alerta.data.packing.serial,this.alerta.data.packing.code).subscribe(result => {
      this.historic = result;
     }, err => {console.log(err)});
  }

}

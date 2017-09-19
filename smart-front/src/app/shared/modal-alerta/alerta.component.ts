import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { InventoryService } from '../../servicos/inventory.service';
import { Pagination } from '../../shared/models/pagination';


@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaModalComponent implements OnInit {
@Input() alerta;
public historicFlag = false;
public historic: Pagination = new Pagination({meta: {page : 1}});
inscricao: Subscription;
  constructor(
    public activeAlerta: NgbActiveModal,
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private router: Router) { }

  ngOnInit() {
    console.log(this.alerta);
  }

  getHistoric(){
    this.inventoryService.getInventoryPackingHistoric(10,this.historic.meta.page,this.alerta.data.packing.serial).subscribe(result => {
      this.historic = result;
     }, err => {console.log(err)});
  }



}

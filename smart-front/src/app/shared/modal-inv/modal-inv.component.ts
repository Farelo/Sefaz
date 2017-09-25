import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { InventoryService } from '../../servicos/inventory.service';
import { Pagination } from '../../shared/models/pagination';


@Component({
  selector: 'app-modal-inv',
  templateUrl: './modal-inv.component.html',
  styleUrls: ['./modal-inv.component.css']
})
export class ModalInvComponent implements OnInit {
  @Input() packing;
  public inscricao: Subscription;
  public data: Pagination = new Pagination({meta: {page : 1}});
  constructor(
    public activeAlerta: NgbActiveModal,
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private router: Router) { }

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory(){
    this.inventoryService.getInventorySupplierByPlantAnd(10,this.data.meta.page,this.packing.code, this.packing.supplier._id, this.packing.project._id).subscribe( result => {
      this.data = result;
      console.log(result);
    });
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadInventory();
  }

}

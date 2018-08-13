import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from '../../servicos/index.service';
import { Pagination } from '../../shared/models/pagination';
import { constants } from '../../../environments/constants';

@Component({
  selector: 'app-modal-inv',
  templateUrl: './modal-inv.component.html',
  styleUrls: ['./modal-inv.component.css'],
})
export class ModalInvComponent implements OnInit {
  @Input()
  packing;
  public data: Pagination = new Pagination({ meta: { page: 1 } });
  constructor(
    public activeAlerta: NgbActiveModal,
    private inventoryService: InventoryService,
  ) {}

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.inventoryService
      .getInventorySupplierByPlantAnd(
        10,
        this.data.meta.page,
        this.packing.code,
        this.packing.supplier._id,
        this.packing.project._id,
      )
      .subscribe(result => {
        this.data = result;

        this.data.data = this.data.data.map(elem => {
          elem.status = constants[elem.status];
          return elem;
        });
      });
  }

  pageChanged(page: any): void {
    this.data.meta.page = page;
    this.loadInventory();
  }
}

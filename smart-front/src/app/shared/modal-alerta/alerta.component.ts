import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  InventoryService,
  InventoryLogisticService,
} from '../../servicos/index.service';
import { Pagination } from '../../shared/models/pagination';
import { LayerModalComponent } from '../modal-packing/layer.component';
import { constants } from '../../../environments/constants';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css'],
})
export class AlertaModalComponent implements OnInit {
  @Input()
  alerta;
  public historicFlag = false;
  public historic: Pagination = new Pagination({ meta: { page: 1 } });

  constructor(
    public activeAlerta: NgbActiveModal,
    private inventoryService: InventoryService,
    private inventoryLogisticService: InventoryLogisticService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    //console.log(JSON.stringify(this.alerta));
  }

  getHistoric() {
    this.inventoryService
      .getInventoryPackingHistoric(
        10,
        this.historic.meta.page,
        this.alerta.data.packing.serial,
        this.alerta.data.packing.code,
      )
      .subscribe(
        result => {
          this.historic = result;
          this.historic.data = this.historic.data.map(elem => {
            elem.status = constants[elem.status];
            return elem;
          });
        },
        err => {
          console.log(err);
        },
      );
  }

  visualizeOnMap() {
    //console.log('open map');
    //console.log('alerta: ' + JSON.stringify(this.alerta));
    //console.log('[alerta-component] alerta: ' + JSON.stringify(this.alerta.data.packing));

    //http://localhost:8984/api/inventory/general/packings/10/1?code=5039991

    this.inventoryService
      .getInventoryGeneralPackings(10, 1, this.alerta.data.packing.code_tag, '')
      .subscribe(
        result => {
          let actualPackage = result.data;
          //console.log('actualPackage: ' + JSON.stringify(actualPackage[0]));

          this.activeAlerta.dismiss('open map');
          const modalRef = this.modalService.open(LayerModalComponent, {
            backdrop: 'static',
            size: 'lg',
            windowClass: 'modal-xl',
          });
          actualPackage[0].alertCode = this.alerta.data.status;
          modalRef.componentInstance.packing = actualPackage[0];
        },
        err => {
          console.log(err);
        },
      );
  }

  generalInventoryEquipament() {}
}

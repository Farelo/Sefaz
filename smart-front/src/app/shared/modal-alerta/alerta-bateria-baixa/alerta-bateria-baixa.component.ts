import { Component, OnInit, Input } from '@angular/core';
import { LayerModalComponent } from '../../modal-packing/layer.component';
import { Pagination } from '../../models/pagination';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService } from '../../../servicos/index.service';
import { constants } from '../../../../environments/constants';

@Component({
  selector: 'app-alerta-bateria-baixa',
  templateUrl: './alerta-bateria-baixa.component.html',
  styleUrls: ['./alerta-bateria-baixa.component.css']
})
export class AlertaBateriaBaixaComponent implements OnInit {

  @Input() alerta;
  public historic: Pagination = new Pagination({ meta: { page: 1 } });

  constructor(
    public activeAlerta: NgbActiveModal,
    private inventoryService: InventoryService, 
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    console.log('bateria baixa');
  }

  visualizeOnMap() { 

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

  generalInventoryEquipament() { }

}

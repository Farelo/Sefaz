import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService, PlantsService } from '../../../servicos/index.service';
import { LayerModalComponent } from '../../modal-packing/layer.component';
import { constants } from '../../../../environments/constants';

@Component({
  selector: 'app-alerta-permanencia',
  templateUrl: './alerta-permanencia.component.html',
  styleUrls: ['./alerta-permanencia.component.css']
})
export class AlertaPermanenciaComponent implements OnInit {

  @Input() alerta;
  public mConstants: any;

  constructor(public activeAlerta: NgbActiveModal,
    private inventoryService: InventoryService,
    private modalService: NgbModal){ 

    this.mConstants = constants;
  }

  ngOnInit() {

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

}
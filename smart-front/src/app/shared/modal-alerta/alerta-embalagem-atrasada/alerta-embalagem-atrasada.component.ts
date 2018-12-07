import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService, PlantsService } from '../../../servicos/index.service';
import { LayerModalComponent } from '../../modal-packing/layer.component';
import { constants } from 'environments/constants';

@Component({
  selector: 'app-alerta-embalagem-atrasada',
  templateUrl: './alerta-embalagem-atrasada.component.html',
  styleUrls: ['./alerta-embalagem-atrasada.component.css']
})
export class AlertaEmbalagemAtrasadaComponent implements OnInit {

  @Input() alerta;
  public mConstants: any;
  
  constructor(
    public activeAlerta: NgbActiveModal,
    private inventoryService: InventoryService,
    private inventoryLogisticService: InventoryLogisticService,
    private plantsService: PlantsService,
    private modalService: NgbModal) { 

    this.mConstants = constants;
  }

  ngOnInit() {
    
    //this.getLastPlant();
  }

  getLastPlant() {
    // if (this.alerta.data.packing.last_plant.plant !== undefined) {
    //   this.plantsService.retrievePlant(this.alerta.data.packing.last_plant.plant).subscribe(result => {
    //     //console.log('result: ' + JSON.stringify(result));

    //     if (result.data.length != {}) {
    //       this.lastPlant = result.data;
    //       //console.log('this.lastPlant: ' + JSON.stringify(this.lastPlant));
    //     }
    //   });
    // }
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

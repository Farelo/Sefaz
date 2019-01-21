import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService, PlantsService, PackingService } from '../../../servicos/index.service';
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
    private packingsService: PackingService,
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

    this.packingsService
      .getPacking(this.alerta._id)
      .subscribe(
        result => {
          let actualPackage = result;
          //console.log('actualPackage: ' + JSON.stringify(actualPackage[0]));

          this.activeAlerta.dismiss('open map');
          const modalRef = this.modalService.open(LayerModalComponent, {
            backdrop: 'static',
            size: 'lg',
            windowClass: 'modal-xl',
          });
          actualPackage.alertCode = this.alerta.current_state;
          actualPackage.tag = actualPackage.tag.code;
          actualPackage.family_code = this.alerta.family.code;
          
          modalRef.componentInstance.packing = actualPackage;
        },
        err => {
          console.log(err);
        },
      );
  }
}

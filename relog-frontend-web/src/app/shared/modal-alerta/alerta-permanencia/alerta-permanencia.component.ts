import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService, PlantsService, PackingService } from '../../../servicos/index.service';
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
    private packingsService: PackingService,
    private modalService: NgbModal){ 

    this.mConstants = constants;
  }

  ngOnInit() {

  }

  visualizeOnMap() { 
    
    this.packingsService
      .getPacking(this.alerta._id)
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
          actualPackage.alertCode = this.alerta.current_state;
          actualPackage.tag = actualPackage.tag.code;
          modalRef.componentInstance.packing = actualPackage;
        },
        err => {
          console.log(err);
        },
      );
  }

}

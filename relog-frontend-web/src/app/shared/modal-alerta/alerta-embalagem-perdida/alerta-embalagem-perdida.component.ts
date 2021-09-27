import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService, RackService } from '../../../servicos/index.service';
import { LayerModalComponent } from '../../modal-rack/layer.component';
import { constants } from 'environments/constants';

@Component({
  selector: 'app-alerta-embalagem-perdida',
  templateUrl: './alerta-embalagem-perdida.component.html',
  styleUrls: ['./alerta-embalagem-perdida.component.css']
})
export class AlertaEmbalagemPerdidaComponent implements OnInit {

  @Input() alerta;
  public mConstants: any;

  constructor(public activeAlerta: NgbActiveModal,
    private racksService: RackService,
    private modalService: NgbModal) {
  
    this.mConstants = constants; 
  }

  ngOnInit() {
    console.log(this.alerta);
  }

  visualizeOnMap() {

    this.racksService
      .getRack(this.alerta._id)
      .subscribe(
        result => {
          let actualPackage = result;

          this.activeAlerta.dismiss('open map');
          const modalRef = this.modalService.open(LayerModalComponent, {
            backdrop: 'static',
            size: 'lg',
            windowClass: 'modal-xl',
          });
          actualPackage.alertCode = this.alerta.current_state;
          actualPackage.tag = actualPackage.tag.code;
          actualPackage.family_code = this.alerta.family.code;
          
          modalRef.componentInstance.rack = actualPackage;
        },
        err => {
          console.log(err);
        },
      );
  }

}

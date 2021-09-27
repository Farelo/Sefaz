import { Component, OnInit, Input } from '@angular/core';
import { LayerModalComponent } from '../../modal-rack/layer.component';
import { Pagination } from '../../models/pagination';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService, RackService } from '../../../servicos/index.service';
import { constants } from '../../../../environments/constants';

@Component({
  selector: 'app-alerta-bateria-baixa',
  templateUrl: './alerta-bateria-baixa.component.html',
  styleUrls: ['./alerta-bateria-baixa.component.css']
})
export class AlertaBateriaBaixaComponent implements OnInit {

  @Input() alerta;
  public mConstants: any;

  constructor(
    public activeAlerta: NgbActiveModal,
    private racksService: RackService,
    private modalService: NgbModal) {

    this.mConstants = constants;
  }

  ngOnInit() {
    console.log('bateria baixa');
  }

  visualizeOnMap() {

    console.log(this.alerta);

    this.racksService
      .getRack(this.alerta._id)
      .subscribe(result => {
        let actualPackage = result;
        //console.log('actualPackage: ' + JSON.stringify(actualPackage));

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

  generalInventoryEquipament() { }

}

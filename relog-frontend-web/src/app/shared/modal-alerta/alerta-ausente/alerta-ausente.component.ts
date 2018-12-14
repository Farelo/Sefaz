import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../models/pagination';
import { InventoryService, InventoryLogisticService } from '../../../servicos/index.service';
import { LayerModalComponent } from '../../modal-packing/layer.component';
import { constants } from '../../../../environments/constants';

@Component({
  selector: 'app-alerta-ausente',
  templateUrl: './alerta-ausente.component.html',
  styleUrls: ['./alerta-ausente.component.css']
})
export class AlertaAusenteComponent implements OnInit {

  @Input() alerta;
  
  public mConstants: any;

  constructor(
    public activeAlerta: NgbActiveModal,
    private inventoryService: InventoryService,
    private modalService: NgbModal) { 
      
    this.mConstants = constants;
  }

  ngOnInit() {
    //console.log(JSON.stringify(this.alerta));
    //this.getHistoric();
  }
 
  getHistoric() {
    // this.inventoryService
    //   .getInventoryPackingHistoric(
    //     10,
    //     this.historic.meta.page,
    //     this.alerta.data.packing.serial,
    //     this.alerta.data.packing.code,
    // ).subscribe(
    //     result => {
    //       this.historic = result;
    //       this.historic.data = this.historic.data.map(elem => {
    //         elem.status = constants[elem.status];
    //         return elem;
    //       });
    //     },
    //     err => {
    //       console.log(err);
    //     },
    // );
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
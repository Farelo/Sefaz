import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../models/pagination';
import { InventoryService, InventoryLogisticService, PackingService } from '../../../servicos/index.service';
import { LayerModalComponent } from '../../modal-packing/layer.component';
import { constants } from '../../../../environments/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alerta-ausente',
  templateUrl: './alerta-ausente.component.html',
  styleUrls: ['./alerta-ausente.component.css']
})
export class AlertaAusenteComponent implements OnInit {

  @Input() alerta;

  public mConstants: any;

  constructor(public translate: TranslateService,
    public activeAlerta: NgbActiveModal,
    private packingsService: PackingService,
    private modalService: NgbModal) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');

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

          console.log(this.alerta);
          console.log(actualPackage);
          modalRef.componentInstance.packing = actualPackage;
        },
        err => {
          console.log(err);
        },
      );
  }

  generalInventoryEquipament() { }

}

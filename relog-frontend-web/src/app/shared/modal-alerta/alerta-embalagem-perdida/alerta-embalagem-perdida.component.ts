import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService, PackingService } from '../../../servicos/index.service';
import { LayerModalComponent } from '../../modal-packing/layer.component';
import { constants } from 'environments/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alerta-embalagem-perdida',
  templateUrl: './alerta-embalagem-perdida.component.html',
  styleUrls: ['./alerta-embalagem-perdida.component.css']
})
export class AlertaEmbalagemPerdidaComponent implements OnInit {

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
    console.log(this.alerta);
  }

  visualizeOnMap() {

    this.packingsService
      .getPacking(this.alerta._id)
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

          modalRef.componentInstance.packing = actualPackage;
        },
        err => {
          console.log(err);
        },
      );
  }

}

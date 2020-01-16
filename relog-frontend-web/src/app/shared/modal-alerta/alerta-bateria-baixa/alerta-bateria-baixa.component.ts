import { Component, OnInit, Input } from '@angular/core';
import { LayerModalComponent } from '../../modal-packing/layer.component';
import { Pagination } from '../../models/pagination';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService, PackingService } from '../../../servicos/index.service';
import { constants } from '../../../../environments/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alerta-bateria-baixa',
  templateUrl: './alerta-bateria-baixa.component.html',
  styleUrls: ['./alerta-bateria-baixa.component.css']
})
export class AlertaBateriaBaixaComponent implements OnInit {

  @Input() alerta;
  public mConstants: any;

  constructor(public translate: TranslateService,
    public activeAlerta: NgbActiveModal,
    private packingsService: PackingService,
    private modalService: NgbModal) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');

    this.mConstants = constants;
  }

  ngOnInit() { }

  visualizeOnMap() {

    console.log(this.alerta);

    this.packingsService
      .getPacking(this.alerta._id)
      .subscribe(result => {
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

  generalInventoryEquipament() { }

}

import { Component, OnInit, Input } from '@angular/core';
import { constants } from '../../../../environments/constants';
import { Pagination } from '../../models/pagination';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService, RoutesService } from '../../../servicos/index.service';
import { LayerModalComponent } from '../../modal-packing/layer.component';

@Component({
  selector: 'app-alerta-local-incorreto',
  templateUrl: './alerta-local-incorreto.component.html',
  styleUrls: ['./alerta-local-incorreto.component.css']
})
export class AlertaLocalIncorretoComponent implements OnInit {

  @Input() alerta;
  
  public listOfRoutes: any[] = [];
  public mConstants: any;

  constructor(
    public activeAlerta: NgbActiveModal,
    private inventoryService: InventoryService,
    private routesService: RoutesService,
    private modalService: NgbModal) { 
    
    this.mConstants = constants;
  }

  ngOnInit() {

    this.routesService.getRoute(this.alerta.family._id).subscribe(result => {
      //this.listOfRoutes = result;
    }, err => console.log(err));
  }

  getHistoric() {
    
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

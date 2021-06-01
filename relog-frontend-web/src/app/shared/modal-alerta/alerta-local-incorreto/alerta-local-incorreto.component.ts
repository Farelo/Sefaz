import { Component, OnInit, Input } from '@angular/core';
import { constants } from '../../../../environments/constants';
import { Pagination } from '../../models/pagination';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService, RoutesService, RackService } from '../../../servicos/index.service';
import { LayerModalComponent } from '../../modal-rack/layer.component';

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
    private racksService: RackService,
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

    this.racksService
      .getRack(this.alerta._id)
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

          modalRef.componentInstance.rack = actualPackage;
        },
        err => {
          console.log(err);
        },
      );
  }

  generalInventoryEquipament() { }

}

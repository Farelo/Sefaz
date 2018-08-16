import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService, PlantsService } from '../../../servicos/index.service';

@Component({
  selector: 'app-alerta-embalagem-atrasada',
  templateUrl: './alerta-embalagem-atrasada.component.html',
  styleUrls: ['./alerta-embalagem-atrasada.component.css']
})
export class AlertaEmbalagemAtrasadaComponent implements OnInit {

  @Input() alerta;
  private lastPlant: any = {
    plant_name: "Sem registro",
    location: "Sem Registro"
  };

  constructor(
    public activeAlerta: NgbActiveModal,
    private plantsService: PlantsService
  ) { }

  ngOnInit() {
    console.log(JSON.stringify(this.alerta));
    this.getLastPlant();
  }

  getLastPlant() {
    if (this.alerta.data.packing.last_plant.plant !== undefined) {
      this.plantsService.retrievePlant(this.alerta.data.packing.last_plant.plant).subscribe(result => {
        console.log('result: ' + JSON.stringify(result));

        if (result.data.length != {}) {
          this.lastPlant = result.data;

          console.log('this.lastPlant: ' + JSON.stringify(this.lastPlant));
        }
      });
    }
  }
}

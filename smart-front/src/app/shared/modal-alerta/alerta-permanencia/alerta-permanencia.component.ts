import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService, InventoryLogisticService } from '../../../servicos/index.service';

@Component({
  selector: 'app-alerta-permanencia',
  templateUrl: './alerta-permanencia.component.html',
  styleUrls: ['./alerta-permanencia.component.css']
})
export class AlertaPermanenciaComponent implements OnInit {

  @Input() alerta;
  constructor(public activeAlerta: NgbActiveModal){ }

  ngOnInit() {
  }

}

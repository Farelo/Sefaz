import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../servicos/packings.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AlertsService } from '../../servicos/alerts.service';
import { Alert } from '../../shared/models/alert';

/*ALerta!*/
import { AlertaComponent } from '../../shared/alerta/alerta.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  embalagens: any[];

  constructor(
    private PackingService: PackingService,
    private AlertsService: AlertsService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  inventory = [];

  ngOnInit() {
    this.PackingService.retrieveInventory(10, 1).subscribe(result => {

      var totalItems = result.count;
      var packings = result.packing_list;
      var found = result.quantity_found;
      var existingQuantity = result.existing_quantity;
      var listProblem = result.list_packing_problem;
      var listMissing = result.list_packing_missing;
      this.inventory = this.inventory.concat(listProblem).concat(listMissing);
      console.log(this.inventory);
    });
  }

  open(numero) {

  }

}

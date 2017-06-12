import { Component, OnInit } from '@angular/core';
import { PackingService } from '../servicos/packings.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  embalagens: any[];

  constructor(
    private PackingService: PackingService
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

}

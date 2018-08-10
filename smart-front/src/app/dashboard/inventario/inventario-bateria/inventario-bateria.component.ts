import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import {
  InventoryLogisticService,
  InventoryService,
  AuthenticationService,
  PackingService,
} from '../../../servicos/index.service';

@Component({
  selector: 'app-inventario-bateria',
  templateUrl: './inventario-bateria.component.html',
  styleUrls: ['./inventario-bateria.component.css'],
})
export class InventarioBateriaComponent implements OnInit {
  public logged_user: any;
  public packings: any[];
  public battery: Pagination = new Pagination({ meta: { page: 1 } });
  public batterySearch = '';

  constructor(
    private inventoryLogisticService: InventoryLogisticService,
    private inventoryService: InventoryService,
    private packingService: PackingService,
    private auth: AuthenticationService,
  ) {
    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
    this.logged_user = user.supplier
      ? user.supplier._id
      : user.official_supplier
        ? user.official_supplier
        : user.logistic
          ? user.logistic.suppliers
          : user.official_logistic
            ? user.official_logistic.suppliers
            : undefined; //works fine
  }

  ngOnInit() {
    this.loadPackings();
  }

  batteryInventory() {
    if (this.logged_user instanceof Array) {
      this.inventoryLogisticService
        .getInventoryBattery(
          10,
          this.battery.meta.page,
          this.batterySearch,
          this.logged_user,
        )
        .subscribe(
          result => (this.battery = result),
          err => {
            console.log(err);
          },
        );
    } else {
      this.inventoryService
        .getInventoryBattery(
          10,
          this.battery.meta.page,
          this.batterySearch,
          this.logged_user,
        )
        .subscribe(
          result => (this.battery = result),
          err => {
            console.log(err);
          },
        );
    }
  }

  loadPackings() {
    if (this.logged_user instanceof Array) {
      this.packingService
        .getPackingsDistinctsByLogistic(this.logged_user)
        .subscribe(
          result => (this.packings = result.data),
          err => {
            console.log(err);
          },
        );
    } else if (this.logged_user) {
      this.packingService
        .getPackingsDistinctsBySupplier(this.logged_user)
        .subscribe(
          result => (this.packings = result.data),
          err => {
            console.log(err);
          },
        );
    } else {
      this.packingService.getPackingsDistincts().subscribe(
        result => {
          this.packings = result.data;
        },
        err => {
          console.log(err);
        },
      );
    }
  }
}

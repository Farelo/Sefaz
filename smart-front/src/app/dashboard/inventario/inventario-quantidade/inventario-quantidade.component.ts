import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../servicos/auth.service';
import {
  InventoryService,
  InventoryLogisticService,
  PackingService,
} from '../../../servicos/index.service';
import { Pagination } from '../../../shared/models/pagination';
import { constants } from '../../../../environments/constants';

@Component({
  selector: 'app-inventario-quantidade',
  templateUrl: './inventario-quantidade.component.html',
  styleUrls: ['./inventario-quantidade.component.css'],
})
export class InventarioQuantidadeComponent implements OnInit {
  public logged_user: any;
  public quantity: Pagination = new Pagination({ meta: { page: 1 } });
  public packings: any[];
  public quantitySearch = '';

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
    this.quantityInventory();
  }

  loadPackings() {
    if (this.logged_user instanceof Array) {
      this.packingService
        .getPackingsDistinctsByLogistic(this.logged_user)
        .subscribe(
          result => {
            this.packings = result.data;
          },
          err => {
            console.log(err);
          },
        );
    } else if (this.logged_user) {
      this.packingService
        .getPackingsDistinctsBySupplier(this.logged_user)
        .subscribe(
          result => {
            this.packings = result.data;
          },
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

  quantityInventory() {
    this.quantitySearch = this.quantitySearch ? this.quantitySearch : '';

    if (this.logged_user instanceof Array) {
      this.inventoryLogisticService
        .getInventoryQuantity(
          10,
          this.quantity.meta.page,
          this.quantitySearch,
          this.logged_user,
        )
        .subscribe(
          result => {
            this.quantity = result;

            this.quantity.data = this.quantity.data.map(elem => {
              elem.status = constants[elem.status];
              return elem;
            });

            console.log('this.quantity.data: ' + JSON.stringify(this.quantity.data));

          },
          err => {
            console.log(err);
          },
        );
    } else {
      this.inventoryService
        .getInventoryQuantity(
          10,
          this.quantity.meta.page,
          this.quantitySearch,
          this.logged_user,
        )
        .subscribe(
          result => {
            this.quantity = result;
 
            this.quantity.data = this.quantity.data.map(elem => {
              elem.status = constants[elem.status];
              return elem;
            });

            console.log('this.quantity.data: ' + JSON.stringify(this.quantity.data));

          },
          err => {
            console.log(err);
          },
        );
    }
  }
}

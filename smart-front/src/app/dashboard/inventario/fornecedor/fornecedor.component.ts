import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { AuthenticationService } from '../../../servicos/auth.service';
import { SuppliersService, InventoryService } from '../../../servicos/index.service';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.css']
})
export class FornecedorComponent implements OnInit {

  public logged_user: any;
  public name_supplier: any = '';
  public suppliers: any;
  public supplier: Pagination = new Pagination({ meta: { page: 1 } });
    
  constructor( 
    private inventoryService: InventoryService,
    private suppliersService: SuppliersService,
    private auth: AuthenticationService
  ) {

    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine

  }

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.suppliersService.retrieveAll().subscribe(result => {
      this.suppliers = result.data;
      //console.log('suppliers: ' + JSON.stringify(this.suppliers));
    }, err => { console.log(err) });
  }

  supplierInventory(event: any): void {
    if (event) {
      
      this.inventoryService.getInventorySupplier(10, this.supplier.meta.page, event._id).subscribe(result => {
        this.supplier = result;
        this.name_supplier = result.data[0];
      }, err => { console.log(err) });

    } else {
      
      this.supplier.data = [];
      this.name_supplier = "";
    }
  }

}

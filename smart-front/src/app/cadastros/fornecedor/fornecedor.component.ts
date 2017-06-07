import { Component, OnInit } from '@angular/core';
import { SuppliersService } from '../../servicos/suppliers.service';;
import { Supplier } from '../../shared/models/supplier';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.css']
})
export class FornecedorComponent implements OnInit {

  constructor(private SuppliersService : SuppliersService) { }
  suppliers : Supplier [];


  loadSuppliers(){
    this.SuppliersService.getSuppliersPagination(10,1)
      .subscribe(suppliers => this.suppliers = suppliers, err => {console.log(err)});
  }
  ngOnInit() {

    this.loadSuppliers();
  }

}

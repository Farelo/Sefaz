import { Component, OnInit } from '@angular/core';
import { SuppliersService } from '../../../servicos/suppliers.service';;
import { Supplier } from '../../../shared/models/supplier';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class FornecedorComponent implements OnInit {

  constructor(private SuppliersService : SuppliersService) { }
  suppliers : Supplier [];
  vazio: boolean = false;


  loadSuppliers(){
    this.SuppliersService.getSuppliersPagination(10,1)
      .subscribe(suppliers => this.suppliers = suppliers, err => {console.log(err)});
  }

  removeDepartment(id):void{
    this.SuppliersService.deleteSupplier(id).subscribe(result =>   this.loadSuppliers(), err => {console.log(err)})
  }

  ngOnInit() {

    this.loadSuppliers();
  }

}

import { Component, OnInit } from '@angular/core';
import { SuppliersService } from '../../../servicos/suppliers.service';;
import { Supplier } from '../../../shared/models/supplier';
import { Pagination } from '../../../shared/models/pagination';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class FornecedorComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search : string;
  constructor(private SuppliersService : SuppliersService) { }

  searchEvent(): void{
    if(this.search != "" && this.search){
      // this.PackingService.getPackingsPaginationByAttr(10,this.data.meta.page,this.search)
      //   .subscribe(result => this.data = result, err => {console.log(err)});
    }else{
      this.loadSuppliers();
    }
  }

  loadSuppliers(){
    this.SuppliersService.getSuppliersPagination(10,1)
      .subscribe(data => this.data = data, err => {console.log(err)});
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.loadSuppliers();
  }

  removeDepartment(id):void{
    this.SuppliersService.deleteSupplier(id).subscribe(result =>   this.loadSuppliers(), err => {console.log(err)})
  }

  ngOnInit() {

    this.loadSuppliers();
  }

}

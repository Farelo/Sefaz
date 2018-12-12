import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { AuthenticationService } from '../../../servicos/auth.service';
import { SuppliersService, InventoryService, ReportsService, CompaniesService } from '../../../servicos/index.service';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.css']
})
export class FornecedorComponent implements OnInit {

  public listOfCompanies: any[] = [];
  public selectedCompany: any = null;

  public listOfQuantityInSuppliers: any[] = [];
  public auxListOfQuantityInSuppliers: any[] = [];
  public listOfQuantityInSuppliersActualPage: number = -1;

  constructor(private reportsService: ReportsService,
    protected companiesService: CompaniesService,
    private auth: AuthenticationService) {

  }

  ngOnInit() {

    this.loadCompanies();
    this.loadReport();
  }

  /**
   * Método para carregar o select
   */
  loadCompanies() {
    this.companiesService.getAllCompanies().subscribe(result => {
      this.listOfCompanies = result;
    }, error => console.error(error))
  }

  /**
   * Método para carregar a lista
   */
  loadReport(){

    this.reportsService.getClientsInventory().subscribe(result => {
      this.listOfQuantityInSuppliers = result;
      this.auxListOfQuantityInSuppliers = result; 
    }, err => { console.log(err) });
  }

  /**
   * Um item do select foi selecionado
   */
  companySelected(event: any): void {
    
    console.log(event);

    if(event){
      this.listOfQuantityInSuppliers = this.auxListOfQuantityInSuppliers.filter(elem => {
        return elem.company_id == event._id;
      });

    }else{
      this.listOfQuantityInSuppliers = this.auxListOfQuantityInSuppliers;
    }
  }

}

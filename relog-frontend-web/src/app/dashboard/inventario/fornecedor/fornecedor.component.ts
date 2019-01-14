import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { AuthenticationService } from '../../../servicos/auth.service';
import { SuppliersService, InventoryService, ReportsService, CompaniesService } from '../../../servicos/index.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

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

   /**
   * ================================================
   * Downlaod csv file
   */

  private csvOptions = {
    showLabels: true,
    fieldSeparator: ';'
  };

  /**
  * Click to download
  */
  downloadCsv(){

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.listOfQuantityInSuppliers.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, 'Inventario Fornecedor', this.csvOptions);
  }

  flatObject(mArray: any) {
    
    //console.log(mArray);

    /**
     * Example:
        let plain = mArray.map(obj => {
          return {
            supplierName: obj.supplier.name,
            equipmentCode: obj._id.code,
            quantityTotal: obj.quantityTotal,
            quantityInFactory: obj.quantityInFactory,
            quantityInSupplier: obj.quantityInSupplier,
            quantityTraveling: obj.quantityTraveling,
            quantityProblem: obj.quantityProblem,
            lostObject: obj.quantityProblem == undefined ? 0 : obj.quantityProblem
          };
        });
        return plain;
     */

     let plainArray = mArray.map(obj => {
          return {
            a1: obj.family_code,
            a2: obj.company,
            a3: obj.control_point_name,
            a4: obj.control_point_type,
            a5: obj.qtd
          };
        });
      
    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any){
    let cabecalho = {
      a1: 'Equipamento',
      a2: 'Empresa Vinculada',
      a3: 'Planta Atual',
      a4: 'Local',
      a5: 'Quantidade',
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }

}

import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../shared/models/pagination'; 
import { InventoryLogisticService, AuthenticationService, PackingService, SuppliersService, InventoryService } from '../../servicos/index.service'; 
import { Angular2Csv } from 'angular2-csv/Angular2-csv'; 

declare var $: any;

//fazer uma refatoração esta muito grande e com o HTML gigantesco
@Component({
  selector: 'app-inventario', 
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})

export class InventarioComponent implements OnInit, OnDestroy  {
  public logged_user: any;
  public suppliers: any;
  public name_supplier: any = '';
  public escolhaGeral: any = 'GERAL';
  public escolhaEquipamento = "";
  public packings: any[];
  public detailedGeneralpackings: any[];
  public abpackings: any[];
  public ab_packings: any[];
  public escolhas: any[];
  public abserials: any[];
  public locals: any[];
  public general:     Pagination = new Pagination({ meta: { page: 1 } });
  public supplier:    Pagination = new Pagination({ meta: { page: 1 } });
  
  public absence:     Pagination = new Pagination({ meta: { page: 1 } });
  
  public general_equipament: Pagination = new Pagination({ meta: { page: 1 } });
  public detailedGeneralInventory: Pagination = new Pagination({ meta: { page: 1 } });
  public detailedInventorySupplierSearch = null;
  public detailedInventoryEquipamentSearch = null;
  public detailedInventorySearchSerial = "";
  public supplierSearch = null;
  
  
  public absenceSearchEquipamento: any;
  public absenceSearchSerial: any;
  public absenceTime: any;
  public escolhaLocal = "Factory";
  public generalEquipamentSearch = "";
  public abserial = false;
  public activeModal: any;
  public isCollapsed = false;

  //Tempo de permanência
  public permanenceSearchSerial = null;
  public serials: any[];
  public serial = false;
  public permanence: Pagination = new Pagination({ meta: { page: 1 } });
  public permanenceSearchEquipamento: any;

  ngOnInit() {
 
    // this.generalInventory();
    // this.tamanhoSelect();
    // this.loadPackings();
    // this.loadAbPackings();
    // this.loadLocals();
  }

  ngOnDestroy() {

    // this.connection.unsubscribe();
  }

  /////////////
  constructor( 
    private auth: AuthenticationService) {

    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine

    if (this.logged_user) {
      this.escolhas = [
        { name: 'GERAL' },
        { name: 'EQUIPAMENTO' },
      ];
    } else {
      this.escolhas = [
        { name: 'GERAL' },
        { name: 'EQUIPAMENTO' },
        { name: 'FORNECEDOR' }];
    }
  }

  changeSelect(event) {
    
  }

}

import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../shared/models/pagination'; 
import { InventoryLogisticService, AuthenticationService, PackingService, SuppliersService, InventoryService } from '../../servicos/index.service'; 
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

//fazer uma refatoração esta muito grande e com o HTML gigantesco
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})

export class InventarioComponent implements OnInit, OnDestroy {
  public logged_user: any;
  public suppliers: any;
  public name_supplier: any = '';
  public escolhaGeral: any = '';
  public escolhaEquipamento = "";
  public packings: any[];
  public detailedGeneralpackings: any[];
  public abpackings: any[];
  public ab_packings: any[];
  public escolhas: any[];
  public optionsEquipment: any[];
  public abserials: any[];
  public locals: any[];
  public general: Pagination = new Pagination({ meta: { page: 1 } });
  public supplier: Pagination = new Pagination({ meta: { page: 1 } });

  public absence: Pagination = new Pagination({ meta: { page: 1 } });

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
    public translate: TranslateService, ) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');

    this.prepareMenu();

    this.escolhaGeral = { name: this.translate.instant('INVENTORY.HEADER.GENERAL_INVENTORY'), value: 0 };
    this.escolhaEquipamento = null;

    this.translate.onLangChange.subscribe((event) => {
      console.log(event);
      this.prepareMenu();
    });

  }

  prepareMenu() {
    this.escolhas = [
      { name: this.translate.instant('INVENTORY.HEADER.GENERAL_CAP'), value: 0 },
      { name: this.translate.instant('INVENTORY.HEADER.EQUIPMENT'), value: 1 },
      { name: this.translate.instant('INVENTORY.HEADER.SUPPLIER'), value: 2 }];

    this.optionsEquipment = [
      { name: this.translate.instant('INVENTORY.HEADER.GENERAL'), value: 0 },
      { name: this.translate.instant('INVENTORY.HEADER.PERMANENCE_TIME'), value: 1 },
      { name: this.translate.instant('INVENTORY.HEADER.ABSENT_TIME'), value: 2 },
      { name: this.translate.instant('INVENTORY.HEADER.BATTERY'), value: 3 },
      { name: this.translate.instant('INVENTORY.HEADER.QUANTITY'), value: 4 },
      { name: this.translate.instant('INVENTORY.HEADER.EQUIPMENT_GENERAL'), value: 5 },
      { name: this.translate.instant('INVENTORY.HEADER.POSITIONS'), value: 6 },
      { name: "Temperatura", value: 7 },
    ];
  }

  changeGeneralOption(event) {
    this.escolhaEquipamento = null;
  }

  changeSelect(event) {
    
  }

}

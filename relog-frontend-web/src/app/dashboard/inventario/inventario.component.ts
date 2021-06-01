import { Component, OnInit, OnDestroy } from "@angular/core";
import { Pagination } from "../../shared/models/pagination";
import { AuthenticationService } from "../../servicos/index.service";

declare var $: any;

@Component({
  selector: "app-inventario",
  templateUrl: "./inventario.component.html",
  styleUrls: ["./inventario.component.css"],
})
export class InventarioComponent implements OnInit, OnDestroy {
  public logged_user: any;
  public suppliers: any;
  public name_supplier: any = "";
  public escolhaGeral: any = "GERAL";
  public escolhaEquipamento = "";
  public racks: any[];
  public detailedGeneralracks: any[];
  public abracks: any[];
  public ab_racks: any[];
  public escolhas: any[];
  public abserials: any[];
  public locals: any[];
  public general: Pagination = new Pagination({ meta: { page: 1 } });
  public supplier: Pagination = new Pagination({ meta: { page: 1 } });

  public absence: Pagination = new Pagination({ meta: { page: 1 } });

  public general_equipament: Pagination = new Pagination({ meta: { page: 1 } });
  public detailedGeneralInventory: Pagination = new Pagination({
    meta: { page: 1 },
  });
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
    // this.loadRacks();
    // this.loadAbRacks();
    // this.loadLocals();
  }

  ngOnDestroy() {
    // this.connection.unsubscribe();
  }
 
  public currentSettings: any = {};

  /////////////
  constructor(private auth: AuthenticationService) { 
    this.currentSettings = this.auth.currentSettings(); 

    this.escolhas = [
      { name: "GERAL" },
      { name: "EQUIPAMENTO" },
      { name: "FORNECEDOR" },
    ];
  }

  changeSelect(event) {}
}

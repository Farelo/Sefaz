import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { InventoryService, PackingService, AuthenticationService, InventoryLogisticService } from '../../../servicos/index.service';
import { AbscenseModalComponent } from '../../../shared/modal-packing-absence/abscense.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inventario-ausencia',
  templateUrl: './inventario-ausencia.component.html',
  styleUrls: ['./inventario-ausencia.component.css']
})
export class InventarioAusenciaComponent implements OnInit {

  public logged_user: any;
  public absence: Pagination = new Pagination({ meta: { page: 1 } });
  public permanence: Pagination = new Pagination({ meta: { page: 1 } });
  public general: Pagination = new Pagination({ meta: { page: 1 } });
  public absenceSearchEquipamento: any;
  public abserials: any[];
  public absenceSearchSerial: any;
  public absenceTime: number = 10;
  public escolhaLocal = "Factory";
  public abserial = false;
  public serials: any[];
  public serial = false;
  public packings: any[];
  public detailedGeneralpackings: any[];
  public abpackings: any[];
  public ab_packings: any[];
  public locals: any[];
  public permanenceSearchSerial = null;

  constructor( 
    private inventoryService: InventoryService,
    private inventoryLogisticService: InventoryLogisticService,
    private packingService: PackingService,
    private modalService: NgbModal,
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
    
    //this.generalInventory(); 
    //this.loadPackings();
     this.loadAbPackings();
     this.loadLocals();

    // this.escolhaLocal = "Supplier";
    // this.absenceInventory();
  }

  onClear() {
    console.log('clear equipment');
    this.serial = false;
    this.serials = [];
    this.permanence = new Pagination({ meta: { page: 1 } })
    this.permanence.data = []
    this.permanenceSearchSerial = null;
  }

  generalInventory() {
    if (this.logged_user instanceof Array) {
      this.inventoryLogisticService.getInventoryGeneral(10, this.general.meta.page, this.logged_user).subscribe(result => this.general = result, err => { console.log(err) });
    } else {
      this.inventoryService.getInventoryGeneral(10, this.general.meta.page, this.logged_user).subscribe(result => this.general = result, err => { console.log(err) });
    }
  }

  /**
 * Carrega o select EQUIPAMENTO
 */
  loadAbPackings() {
    if (this.logged_user instanceof Array) {
      this.packingService.getPackingsDistinctsByLogistic(this.logged_user).subscribe(result => {
        this.ab_packings = result.data;
        //console.log('loadAbPackings logistic - this.ab_packings: ' + JSON.stringify(this.ab_packings));
      }, err => { console.log(err) });

    } else if (this.logged_user) {
      this.packingService.getPackingsDistinctsBySupplier(this.logged_user).subscribe(result => {
        this.ab_packings = result.data;
        //console.log('loadAbPackings supplier  - this.ab_packings: ' + JSON.stringify(this.ab_packings));
      }, err => { console.log(err) });

    } else {
      this.packingService.getPackingsDistincts().subscribe(result => {
        this.ab_packings = result.data;
        this.absenceTime = 10;
        //console.log('loadAbPackings distincit - this.ab_packings: ' + JSON.stringify(this.ab_packings));
      }, err => { console.log(err) });
    }
  }

  /**
   * Click no select EQUIPAMENTO ou clear no SERIAL
   */
  absenceInventory() {

    this.absence = new Pagination({ meta: { page: 1 } });

    if (this.absenceSearchEquipamento) {
      //console.log('.absenceSearchEquipamento: ' + JSON.stringify(this.absenceSearchEquipamento));

      this.packingService
        .getPackingsEquals(this.absenceSearchEquipamento.supplier._id, this.absenceSearchEquipamento.project._id, this.absenceSearchEquipamento.packing)
        .subscribe(result => {
          this.abserials = result.data;
          //console.log('.abserials: ' + JSON.stringify(this.abserials));

          this.inventoryService
            .getAbsencePermanence(10, this.absence.meta.page, this.absenceSearchEquipamento.packing, this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
            .subscribe(result => {

              if (result.data) {

                this.absence = result;
                //console.log('.absence: ' + JSON.stringify(this.absence));
              }
            }, err => { console.log(err) });
        }, err => { console.log(err) })

    } else {
      console.log('..absenceSearchEquipamento: null');

      this.inventoryService
        .getAbsencePermanence(10, this.absence.meta.page, "todos", this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
        .subscribe(result => {

          if (result.data) {

            this.absence = result;
            //console.log('..absence: ' + JSON.stringify(this.absence));
          }
        }, err => { console.log(err) });
      this.absenceSearchSerial = "";
      this.abserial = false;
      this.abserials = [];
      this.absence.data = []
    }
  }

  serialCleared(){
    //console.log('serialCleared: ' + JSON.stringify(this.absenceSearchEquipamento));

    this.inventoryService
      .getAbsencePermanence(10, this.absence.meta.page, "todos", this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
      .subscribe(result => {

        if (result.data) {

          this.absence = result
        }
      }, err => { console.log(err) });
    this.absenceSearchSerial = "";
    this.abserial = false;
    this.abserials = [];
    this.absence.data = []
  }

  absenceInventoryChangePage() {

    //console.log('absenceSearchEquipamento: ' + JSON.stringify(this.absenceSearchEquipamento));

    if (this.absenceSearchEquipamento) {

      this.packingService
        .getPackingsEquals(this.absenceSearchEquipamento.supplier._id, this.absenceSearchEquipamento.project._id, this.absenceSearchEquipamento.packing)
        .subscribe(result => {
          this.abserials = result.data;
          this.inventoryService
            .getAbsencePermanence(10, this.absence.meta.page, this.absenceSearchEquipamento.packing, this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
            .subscribe(result => {

              if (result.data) {

                this.absence = result
              }
            }, err => { console.log(err) });
        }, err => { console.log(err) })

    } else {
      this.inventoryService
        .getAbsencePermanence(10, this.absence.meta.page, "todos", this.absenceTime, this.absenceSearchSerial, this.escolhaLocal)
        .subscribe(result => {

          if (result.data) {

            this.absence = result
          }
        }, err => { console.log(err) });
      this.absenceSearchSerial = "";
      this.abserial = false;
      this.abserials = [];
    }

  }

  absenceInventorySerial() {
    this.serial = true;

    this.inventoryService.getInventoryAbsencePacking(10, this.permanence.meta.page, this.absenceSearchSerial, this.absenceSearchEquipamento.packing, this.logged_user).subscribe(result => {
      this.permanence = result;
    }, err => { console.log(err) });

  }

  loadPackings() {
    if (this.logged_user instanceof Array) {
      this.packingService.getPackingsDistinctsByLogistic(this.logged_user).subscribe(result => this.packings = result.data, err => { console.log(err) });

    } else if (this.logged_user) {
      this.packingService.getPackingsDistinctsBySupplier(this.logged_user).subscribe(result => this.packings = result.data, err => { console.log(err) });
    } else {
      this.packingService.getPackingsDistincts().subscribe(result => { this.packings = result.data }, err => { console.log(err) });
    }
  }

  /**
   * Carrega os locais do select LOCAL DA AUSÊNCIA
   */
  loadLocals() {
    //this.locals = [ { "local" : "Todos"} , {"local": "Fornecedor"}, { "local": "Clientes"} ];
    this.locals = [{ "local": "Plantas das Embarcadoras" }];
  }

  changeLocal(){
    
    if (this.escolhaLocal == null) this.escolhaLocal = "Supplier";
    this.absenceInventory();
  }

  openAbsence(packing) {
    const modalRef = this.modalService.open(AbscenseModalComponent, { backdrop: "static", size: "lg" });
    modalRef.componentInstance.packing = packing;
  }
  
}

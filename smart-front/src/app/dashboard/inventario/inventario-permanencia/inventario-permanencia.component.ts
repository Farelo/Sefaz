import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination'; 
import { InventoryService, PackingService, AuthenticationService } from '../../../servicos/index.service';

@Component({
  selector: 'app-inventario-permanencia',
  templateUrl: './inventario-permanencia.component.html',
  styleUrls: ['./inventario-permanencia.component.css']
})
export class InventarioPermanenciaComponent implements OnInit {

  @Input() selectedEquipament: any;
  @Input() selectedSerial: any;

  public logged_user: any; 
  public serial = false;
  public permanence: Pagination = new Pagination({ meta: { page: 1 } }); 
  public serials: any[];
  public packings: any[];

  constructor(
    private inventoryService: InventoryService,
    private packingService: PackingService,
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
    this.loadPackings();
  }

  onClear() {
    console.log('clear equipment');
    this.serial = false;
    this.serials = [];
    this.permanence = new Pagination({ meta: { page: 1 } })
    this.permanence.data = []
    this.selectedSerial = null;
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['selectedEquipament']) {
      console.log('ngOnChanges selectedEquipament: ' + JSON.stringify(this.selectedEquipament));
      if ((this.selectedEquipament !== null) && (this.selectedEquipament !== undefined))
        this.permanenceInventory();
      else
        this.permanence = new Pagination({ meta: { page: 1 } }); 
        this.permanence.data = [];
    }

    if (changes['selectedSerial']) {
      console.log('ngOnChanges selectedSerial: ' + JSON.stringify(this.selectedSerial));
      if ((this.selectedSerial !== null) && (this.selectedSerial !== undefined))
        this.permanenceInventorySerial();
      else
        if ((this.selectedEquipament !== null) && (this.selectedEquipament !== undefined))
          this.permanenceInventory();
    }
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
   * Filtro Equipamento selecionado
   */
  permanenceInventory() {
    this.selectedSerial = null;
    this.serial = false;
    this.serials = [];

    if (this.selectedEquipament) {

      this.packingService
        .getPackingsEquals(this.selectedEquipament.supplier._id, this.selectedEquipament.project._id, this.selectedEquipament.packing)
        .subscribe(result => {
          this.serials = result.data;
          this.inventoryService
            .getInventoryPermanence(10, this.permanence.meta.page, this.selectedEquipament.packing)
            .subscribe(result => this.permanence = result, err => { console.log(err) });
        }, err => { console.log(err) })
    }
  }

  permanenceInventorySerial() {
    this.serial = true;

    this.inventoryService.
      getInventoryPackingHistoric(10, 
        this.permanence.meta.page, 
        this.selectedSerial, 
        this.selectedEquipament.packing, 
        this.logged_user).subscribe(result => {

        this.permanence = result;
        console.log('result: ' + result); 
    }, err => { console.log(err) });
  }

}

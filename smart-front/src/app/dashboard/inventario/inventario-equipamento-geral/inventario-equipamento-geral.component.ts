import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../servicos/auth.service';
import { PackingService, InventoryLogisticService, InventoryService } from '../../../servicos/index.service';
import { Pagination } from '../../../shared/models/pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LayerModalComponent } from '../../../shared/modal-packing/layer.component';

@Component({
  selector: 'app-inventario-equipamento-geral',
  templateUrl: './inventario-equipamento-geral.component.html',
  styleUrls: ['./inventario-equipamento-geral.component.css']
})
export class InventarioEquipamentoGeralComponent implements OnInit {

  public logged_user: any;
  public packings: any[];
  public general_equipament: Pagination = new Pagination({ meta: { page: 1 } });
  public generalEquipamentSearch = "";

  constructor(
    private packingService: PackingService,
    private inventoryLogisticService: InventoryLogisticService,
    private inventoryService: InventoryService,
    private modalService: NgbModal,
    private auth: AuthenticationService ) {

    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine
  }

  ngOnInit() {
    this.loadPackings();
    this.generalInventoryEquipament();
  }

  /**
   * Carrega a lista de embalagens no select
   */
  loadPackings() {
    if (this.logged_user instanceof Array) {
      this.packingService.getPackingsDistinctsByLogistic(this.logged_user).subscribe(result => this.packings = result.data, err => { console.log(err) });

    } else if (this.logged_user) {
      this.packingService.getPackingsDistinctsBySupplier(this.logged_user).subscribe(result => this.packings = result.data, err => { console.log(err) });
    } else {
      this.packingService.getPackingsDistincts().subscribe(result => { 
        this.packings = result.data;
        console.log('this.packings: ' + JSON.stringify(this.packings));
    }, err => { console.log(err) });
    }
  }
  
  //getInventoryGeneralPackings(limit: number, page: number, code: string, attr: string = '', code_packing: string =''): Observable<any> {
  generalInventoryEquipament() {
    
    console.log('=====generalInventoryEquipament');
    console.log('this.generalEquipamentSearch: ' + JSON.stringify(this.generalEquipamentSearch));
    
    if (this.generalEquipamentSearch == null) this.generalEquipamentSearch = '';

    if (this.logged_user instanceof Array) {
      this.inventoryLogisticService.getInventoryGeneralPackings(10, 
        this.general_equipament.meta.page, 
        this.generalEquipamentSearch,
        this.logged_user).subscribe(result => {
          this.general_equipament = result;
          console.log('this.general_equipament: ' + JSON.stringify(this.general_equipament));

        }, err => { console.log(err) });

    } else {
      this.inventoryService.getInventoryGeneralPackings(10, 
        this.general_equipament.meta.page, 
        '',
        this.logged_user,
        this.generalEquipamentSearch).subscribe(result => {
          this.general_equipament = result;
          console.log('this.general_equipament: ' + JSON.stringify(this.general_equipament));
        }, err => { console.log(err) });
    }
  }
  
  generalInventoryEquipamentChanged(){
    if (this.generalEquipamentSearch){
      console.log('.generalInventoryEquipamentChanged this.generalEquipamentSearch: ' + JSON.stringify(this.generalEquipamentSearch));
      this.packingService.getPackingsByPackingCode(this.generalEquipamentSearch, 10, this.general_equipament.meta.page).subscribe(result => {
        
        result.meta = {
          page: result.data.page,
          limit: result.data.limit,
          total_pages: result.data.pages,
          total_docs: result.data.total
        };

        result.data = result.data.docs;

        console.log('.generalInventoryEquipamentChanged ...result: ' + JSON.stringify(result));

        // this.general_equipament = new Pagination({ meta: { page: 1 } });
        this.general_equipament = result;

        console.log('.generalInventoryEquipamentChanged ...this.general_equipament: ' + JSON.stringify(this.general_equipament));
      }, err => { console.log(err) });

    }else{
      console.log('..generalInventoryEquipamentChanged this.generalEquipamentSearch: ' + JSON.stringify(this.generalEquipamentSearch));

      this.general_equipament = new Pagination({ meta: { page: 1 } });
      this.generalEquipamentSearch = "";
      this.general_equipament.data = [];
      this.generalInventoryEquipament();
    }
  }

  openLayer(packing) {
    const modalRef = this.modalService.open(LayerModalComponent, { backdrop: "static", size: "lg", windowClass: 'modal-xl' });
    modalRef.componentInstance.packing = packing;
  }

  getFormatedData(t: any){
    return (new Date(t*1000).toLocaleString());
  }
}

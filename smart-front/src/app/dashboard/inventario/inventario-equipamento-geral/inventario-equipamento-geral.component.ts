import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../servicos/auth.service';
import {
  PackingService,
  InventoryLogisticService,
  InventoryService,
} from '../../../servicos/index.service';
import { Pagination } from '../../../shared/models/pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LayerModalComponent } from '../../../shared/modal-packing/layer.component';
import { constants } from '../../../../environments/constants';

@Component({
  selector: 'app-inventario-equipamento-geral',
  templateUrl: './inventario-equipamento-geral.component.html',
  styleUrls: ['./inventario-equipamento-geral.component.css'],
})
export class InventarioEquipamentoGeralComponent implements OnInit {
  public logged_user: any;
  public packings: any[];
  public general_equipament: Pagination = new Pagination({ meta: { page: 1 } });
  public generalEquipamentSearch = '';

  constructor(
    private packingService: PackingService,
    private inventoryLogisticService: InventoryLogisticService,
    private inventoryService: InventoryService,
    private modalService: NgbModal,
    private auth: AuthenticationService,
  ) {
    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
    this.logged_user = user.supplier
      ? user.supplier._id
      : user.official_supplier
        ? user.official_supplier
        : user.logistic
          ? user.logistic.suppliers
          : user.official_logistic
            ? user.official_logistic.suppliers
            : undefined; //works fine
  }

  ngOnInit() {
    this.loadTableHeaders();
    this.loadPackings();
    this.generalInventoryEquipament();
  }

  public headers: any = [];
  public sort: any = ['none', 'asc', 'desc'];

  loadTableHeaders() {
    this.headers.push({ name: 'Equipamento', label: 'code', status: this.sort[0] });
    this.headers.push({ name: 'Serial', label: 'serial', status: this.sort[0] });
    this.headers.push({ name: 'Tag', label: 'tag.code', status: this.sort[0] });
    this.headers.push({ name: 'Fornecedor', label: 'supplier.name', status: this.sort[0] });
    this.headers.push({ name: 'Status Atual', label: 'status_pt', status: this.sort[0] });
    this.headers.push({ name: 'Planta Atual', label: 'actual_plant.plant', status: this.sort[0] });
    this.headers.push({ name: 'Local', label: 'actual_plant.local', status: this.sort[0] });
    this.headers.push({ name: 'Bateria', label: 'battery', status: this.sort[0] });
    this.headers.push({ name: 'Acurácia', label: 'position.accuracy', status: this.sort[0] });
    // this.headers.push({ name: 'Temperatura', label: 'temperature', status: this.sort[0] });

    console.log('this.headers: ' + JSON.stringify(this.headers));
  }

  headerClick(item: any) {

    let index = this.headers.indexOf(item);

    //atualizar status em todos
    this.headers[index].status = this.sort[(this.sort.indexOf(item.status) + 1) % 3];
    this.headers.map(elem => {
      if (elem.name !== this.headers[index].name) return elem.status = this.sort[0];
      else return elem;
    });

    this.orderTable(this.headers[index]);
  }

  orderTable(elem: any) {
    if (elem.status == this.sort[0]) {
      this.generalInventoryEquipament('', '');

    } else {
      this.generalInventoryEquipament(elem.label, elem.status);
    }
  }

  paginationChanged() {
    let orderedBy = this.headers.filter(elem => {
      return elem.status != this.sort[0];
    });

    console.log('orderedBy: ' + JSON.stringify(orderedBy));

    if (orderedBy.length > 0)
      this.orderTable(orderedBy[0]);
    else
      this.generalInventoryEquipament();
  }
  /**
   * Carrega a lista de embalagens no select
   */
  loadPackings() {
    if (this.logged_user instanceof Array) {
      this.packingService
        .getPackingsDistinctsByLogistic(this.logged_user)
        .subscribe(
          result => (this.packings = result.data),
          err => {
            console.log(err);
          },
        );
    } else if (this.logged_user) {
      this.packingService
        .getPackingsDistinctsBySupplier(this.logged_user)
        .subscribe(
          result => (this.packings = result.data),
          err => {
            console.log(err);
          },
        );
    } else {
      this.packingService.getPackingsDistincts().subscribe(
        result => {
          this.packings = result.data;
          //console.log('this.packings: ' + JSON.stringify(this.packings));
        },
        err => {
          console.log(err);
        },
      );
    }
  }

  //getInventoryGeneralPackings(limit: number, page: number, code: string, attr: string = '', code_packing: string =''): Observable<any> {
  generalInventoryEquipament(sort_by: string = '', order: string = '') {
    // console.log('=====generalInventoryEquipament');
    // console.log(
    //   'this.generalEquipamentSearch: ' +
    //     JSON.stringify(this.generalEquipamentSearch),
    // );

    if (this.generalEquipamentSearch == null) this.generalEquipamentSearch = '';

    /**
     * getInventoryGeneralPackings(
     *    limit: number, 
     *    page: number, 
     *    code: string, 
     *    supplier: string = '', 
     *    code_packing: string =''): Observable<any> { }
     */
    console.log('this.logged_user: ' + this.logged_user);

    if (this.logged_user instanceof Array) {
      this.inventoryLogisticService
        .getInventoryGeneralPackings(
          10,
          this.general_equipament.meta.page,
          this.generalEquipamentSearch,
          this.logged_user,
        )
        .subscribe(
          result => {
            this.general_equipament = result;

            this.general_equipament.data = this.general_equipament.data.map(
              elem => {
                elem.status = constants[elem.status];
                return elem;
              },
            );

            console.log(
              'this.general_equipament: ' +
              JSON.stringify(this.general_equipament),
            );
          },
          err => {
            console.log(err);
          },
        );
    } else {
      this.inventoryService
        .getInventoryGeneralPackings(
          10,
          this.general_equipament.meta.page,
          '',
          this.logged_user,
          this.generalEquipamentSearch,
          sort_by,
          order)
        .subscribe(
          result => {
            this.general_equipament = result;

            this.general_equipament.data = this.general_equipament.data.map(
              elem => {
                elem.status = constants[elem.status];
                return elem;
              },
            );

            // console.log(
            //   'this.general_equipament: ' +
            //     JSON.stringify(this.general_equipament),
            // );
          },
          err => {
            console.log(err);
          },
        );
    }
  }

  generalInventoryEquipamentChanged() {
    if (this.generalEquipamentSearch) {
      console.log(
        '.generalInventoryEquipamentChanged this.generalEquipamentSearch: ' +
        JSON.stringify(this.generalEquipamentSearch),
      );
      this.packingService
        .getPackingsByPackingCode(
          this.generalEquipamentSearch,
          10,
          this.general_equipament.meta.page,
        )
        .subscribe(
          result => {
            result.meta = {
              page: result.data.page,
              limit: result.data.limit,
              total_pages: result.data.pages,
              total_docs: result.data.total,
            };

            result.data = result.data.docs;

            console.log(
              '.generalInventoryEquipamentChanged ...result: ' +
              JSON.stringify(result),
            );

            // this.general_equipament = new Pagination({ meta: { page: 1 } });
            this.general_equipament = result;

            this.general_equipament.data = this.general_equipament.data.map(
              elem => {
                elem.status = constants[elem.status];
                return elem;
              },
            );

            console.log(
              '.generalInventoryEquipamentChanged ...this.general_equipament: ' +
              JSON.stringify(this.general_equipament),
            );
          },
          err => {
            console.log(err);
          },
        );
    } else {
      console.log(
        '..generalInventoryEquipamentChanged this.generalEquipamentSearch: ' +
        JSON.stringify(this.generalEquipamentSearch),
      );

      this.general_equipament = new Pagination({ meta: { page: 1 } });
      this.generalEquipamentSearch = '';
      this.general_equipament.data = [];
      this.generalInventoryEquipament();
    }
  }

  openLayer(packing) {
    const modalRef = this.modalService.open(LayerModalComponent, {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'modal-xl',
    });
    modalRef.componentInstance.packing = packing;
  }

  getFormatedMeter(m: any){
    return `Acurácia de ${m} metros`;
  }

  getFormatedData(t: any) {
    if (t == undefined) return "Sem Registro";
    return new Date(t * 1000).toLocaleString();
  }
}

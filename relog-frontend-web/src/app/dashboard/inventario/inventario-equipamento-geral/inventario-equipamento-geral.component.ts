import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../servicos/auth.service';
import { ReportsService, FamiliesService } from '../../../servicos/index.service';
import { Pagination } from '../../../shared/models/pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LayerModalComponent } from '../../../shared/modal-packing/layer.component';
import { constants } from '../../../../environments/constants';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-inventario-equipamento-geral',
  templateUrl: './inventario-equipamento-geral.component.html',
  styleUrls: ['./inventario-equipamento-geral.component.css'],
})
export class InventarioEquipamentoGeralComponent implements OnInit {

  public logged_user: any;
  public listOfFamilies: any[] = [];
  public familySearch = '';
  public generalEquipament: any[] = [];
  public auxGeneralEquipament: any[] = [];
  public actualPage: number = -1; //página atual
  public temp: any[] = [];

  constructor(
    private reportsService: ReportsService,
    private familyService: FamiliesService, 
    private modalService: NgbModal,
    private auth: AuthenticationService) {

    let user = this.auth.currentUser();
    let current_user = this.auth.currentUser();
  }

  ngOnInit() {

    //Loads the table headers
    this.loadTableHeaders();

    //Loads the families in the select
    this.loadListOfFamilies();

    //Loads the data in the table
    this.generalInventoryEquipament();
  }

  /**
   * Load the list of companies
   */
  loadListOfFamilies(): void {

    this.familyService.getAllFamilies().subscribe(result => {

      this.listOfFamilies = result; 
    }, err => console.error(err));
  }

  generalInventoryEquipament() {

    this.reportsService.getGeneralInventory().subscribe(result => {
      this.generalEquipament = result;
      this.auxGeneralEquipament = result;
    }, err => console.error(err));
  }

  generalInventoryEquipamentChanged(family) {

    if(family)
      this.generalEquipament = this.auxGeneralEquipament.filter(item => item.family_code == family.code);
    else
      this.generalEquipament = this.auxGeneralEquipament;
  }

  openLayer(packing) {
    const modalRef = this.modalService.open(LayerModalComponent, {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'modal-xl',
    });
    modalRef.componentInstance.packing = packing;
  }

  getFormatedData(t: any) {
    if (t == undefined || isNaN(t)) return "Sem Registro";
    return new Date(t * 1000).toLocaleString();
  }


  /**
   * 
   * Ordenação da tabela
   */ 
  public headers: any = [];
  public sortStatus: any = ['asc', 'desc'];
  public sort: any = {
    name: '',
    order: ''
  };

  loadTableHeaders() {
    this.headers.push({ label: 'Código', name: 'family_code' });
    this.headers.push({ label: 'Serial', name: 'serial' });
    this.headers.push({ label: 'Tag', name: 'tag' });

    this.headers.push({ label: 'Fornecedor?', name: 'company' });
    this.headers.push({ label: 'Status Atual', name: 'current_state' });
    this.headers.push({ label: 'Planta Atual', name: 'current_control_point_name' });

    this.headers.push({ label: 'Local', name: 'current_control_point_type' });
    this.headers.push({ label: 'Bateria', name: 'battery_percentage' });
    this.headers.push({ label: 'Acurácia', name: 'accuracy' });
    
    //console.log('this.headers: ' + JSON.stringify(this.headers));
  }

  headerClick(item: any) {
    this.sort.name = item.name;
    this.sort.order = this.sortStatus[(this.sortStatus.indexOf(this.sort.order) + 1) % 2];

    console.log('---');
    console.log('this.sort: ' + JSON.stringify(this.sort));

    this.generalEquipament = this.customSort(this.generalEquipament, item.name.split("."), this.sort.order);
  }

  /**
   * 
   * @param array     All items.
   * @param keyArr    Array with attribute path, if exists.
   * @param reverse   optional. 1 if ascendent, -1 else.
   */
  customSort(array: any[], keyArr: any[], reverse = 'asc') {
    var sortOrder = 1;
    if (reverse == 'desc') sortOrder = -1;

    console.log('array.length: ' + array.length);
    console.log('keyArr: ' + keyArr);
    console.log('sortOrder: ' + sortOrder);

    return array.sort(function (a, b) {
      var x = a, y = b;
      for (var i = 0; i < keyArr.length; i++) {
        x = x[keyArr[i]];
        y = y[keyArr[i]];
      }
      return sortOrder * ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
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
    let flatObjectData = this.flatObject(this.generalEquipament.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, 'Inventario Equipamento Geral', this.csvOptions);
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
            a2: obj.serial,
            a3: obj.tag,
            a4: obj.company,
            a5: obj.current_state,
            a6: obj.current_control_point_name,
            a7: obj.current_control_point_type,
            a8: (obj.battery_percentage == null) ? 0 : obj.battery_percentage,
            a9: obj.accuracy,
            a10: obj.date
          };
        });
      
    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any){
    let cabecalho = {
      a1: 'Família',
      a2: 'Serial',
      a3: 'Tag',
      a4: 'Fornecedor',
      a5: 'Status Atual',
      a6: 'Planta Atual',
      a7: 'Local',
      a8: 'Bateria',
      a9: 'Acurácia',
      a10: 'Data do sinal'
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }
}

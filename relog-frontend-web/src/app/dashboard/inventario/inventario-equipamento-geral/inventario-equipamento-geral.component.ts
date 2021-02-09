import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../servicos/auth.service";
import {
  ReportsService,
  FamiliesService,
} from "../../../servicos/index.service";
import { Pagination } from "../../../shared/models/pagination";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LayerModalComponent } from "../../../shared/modal-packing/layer.component";
import { constants } from "../../../../environments/constants";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { RoundPipe } from "../../../shared/pipes/round";
import { PackingStatus } from "app/shared/pipes/packingStatus";
import "jspdf";
import "jspdf-autotable";
declare var jsPDF: any;

@Component({
  selector: "app-inventario-equipamento-geral",
  templateUrl: "./inventario-equipamento-geral.component.html",
  styleUrls: ["./inventario-equipamento-geral.component.css"],
})
export class InventarioEquipamentoGeralComponent implements OnInit {
  public logged_user: any;
  public listOfFamilies: any[] = [];
  public familySearch = "";
  public generalEquipament: any[] = [];
  public auxGeneralEquipament: any[] = [];
  public actualPage: number = -1; //página atual
  public temp: any[] = [];
  public requestCompleted = false;

  constructor(
    private reportsService: ReportsService,
    private familyService: FamiliesService,
    private modalService: NgbModal,
    private auth: AuthenticationService
  ) {
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
    this.familyService.getAllFamilies().subscribe(
      (result) => {
        this.listOfFamilies = result;
      },
      (err) => console.error(err)
    );
  }

  /**
   * Default list
   */
  generalInventoryEquipament() {
    
    this.reportsService.getGeneralInventory().subscribe(
      (result) => {
        this.generalEquipament = result;
        this.auxGeneralEquipament = result;
        this.requestCompleted = true;
      },
      (err) => console.error(err)
    );
  }

  generalInventoryEquipamentChanged(family) {
    if (family)
      this.generalEquipament = this.auxGeneralEquipament.filter(
        (item) => item.family_code == family.code
      );
    else this.generalEquipament = this.auxGeneralEquipament;
  }

  searchEvent(event): void {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.auxGeneralEquipament.filter(function (item) {
      return (
        item.family_code.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        item.serial.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        item.tag.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });

    // update the rows
    this.generalEquipament = temp;
    // Whenever the filter changes, always go back to the first page
    this.actualPage = 0;
  }

  openLayer(packing) {
    const modalRef = this.modalService.open(LayerModalComponent, {
      size: "lg",
      windowClass: "modal-xl",
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
  public sortStatus: any = ["asc", "desc"];
  public sort: any = {
    name: "",
    order: "",
  };

  loadTableHeaders() {
    this.headers.push({ label: "Família", name: "family_code" });
    this.headers.push({ label: "Serial", name: "serial" });
    this.headers.push({ label: "Tag", name: "tag" });

    this.headers.push({ label: "Vinculada", name: "company" });
    this.headers.push({ label: "Status Atual", name: "current_state" });
    this.headers.push({
      label: "Planta Atual",
      name: "current_control_point_name",
    });

    this.headers.push({ label: "Local", name: "current_control_point_type" });
    this.headers.push({ label: "Bateria", name: "battery_percentage" });
    this.headers.push({
      label: "Acurácia da Entrada/Saída",
      name: "in_out_accuracy",
    });

    this.headers.push({ label: "Data da Entrada/Saída", name: "in_out_date" });
    this.headers.push({ label: "Última Acurácia", name: "accuracy" });
    this.headers.push({ label: "Último Sinal", name: "date" });

    //console.log('this.headers: ' + JSON.stringify(this.headers));
  }

  headerClick(item: any) {
    this.sort.name = item.name;
    this.sort.order = this.sortStatus[
      (this.sortStatus.indexOf(this.sort.order) + 1) % 2
    ];

    // console.log('---');
    // console.log('this.sort: ' + JSON.stringify(this.sort));

    this.generalEquipament = this.customSort(
      this.generalEquipament,
      item.name.split("."),
      this.sort.order
    );
  }

  /**
   *
   * @param array     All items.
   * @param keyArr    Array with attribute path, if exists.
   * @param reverse   optional. 1 if ascendent, -1 else.
   */
  customSort(array: any[], keyArr: any[], reverse = "asc") {
    var sortOrder = 1;
    if (reverse == "desc") sortOrder = -1;

    // console.log('array.length: ' + array.length);
    // console.log('keyArr: ' + keyArr);
    // console.log('sortOrder: ' + sortOrder);

    return array.sort(function (a, b) {
      var x = a,
        y = b;
      for (var i = 0; i < keyArr.length; i++) {
        x = x[keyArr[i]];
        y = y[keyArr[i]];
      }
      return sortOrder * (x < y ? -1 : x > y ? 1 : 0);
    });
  }

  /**
   * ================================================
   * Downlaod csv file
   */

  private csvOptions = {
    showLabels: true,
    fieldSeparator: ";",
  };

  /**
   * Click to download
   */
  downloadCsv() {
    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.generalEquipament.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);
    // console.log(flatObjectData);
    //Instantiate a new csv object and initiate the download
    new Angular2Csv(
      flatObjectData,
      "Inventario Equipamento Geral",
      this.csvOptions
    );
  }

  /**
   * Click to download pdf file
   */
  downloadPdf() {
    let doc = jsPDF("l", "pt", "a4");

    // You can use html:
    //doc.autoTable({ html: '#my-table' });

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    console.log(this.generalEquipament);
    console.log(this.generalEquipament.slice());

    let flatObjectData = this.flatObject(this.generalEquipament.slice());

    var columns = [
      { title: "Família", dataKey: "family" },
      { title: "Serial", dataKey: "serial" },
      { title: "Tag", dataKey: "tag" },
      { title: "Empresa vinculada", dataKey: "company" },
      { title: "Status Atual", dataKey: "status" },
      { title: "Planta Atual", dataKey: "control_point" },
      { title: "Local", dataKey: "type" },
      { title: "Bateria", dataKey: "battery" },
      { title: "Acurácia", dataKey: "accuracy" },
      { title: "Data do sinal", dataKey: "date" },
      { title: "Última acurácia", dataKey: "lastAccuracy" },
      { title: "Último sinal", dataKey: "lastSignal" },
    ];

    doc.autoTable(columns, flatObjectData, {
      styles: {
        fontSize: 6,
      },
    });
    doc.save("general_equipment.pdf");
  }

  flatObject(mArray: any) {
    let transformer = new RoundPipe();
    let packingStatus = new PackingStatus();

    return mArray.map((obj) => {
      return {
        family: obj.family_code,
        serial: obj.serial,
        tag: obj.tag,
        company: obj.company,
        status: packingStatus.transform(obj.current_state),
        control_point: obj.current_control_point_name,
        type: obj.current_control_point_type,
        battery:
          obj.battery_percentage != undefined && obj.battery_percentage >= 0
            ? transformer.transform(obj.battery_percentage)
            : "Sem Registro",
        accuracy: obj.in_out_accuracy,
        date: obj.in_out_date,
        lastAccuracy: obj.accuracy,
        lastSignal: obj.date,
      };
    });
  }

  addHeader(mArray: any) {
    let cabecalho = {
      family: "Família",
      serial: "Serial",
      tag: "Tag",
      company: "Fornecedor",
      status: "Status Atual",
      control_point: "Planta Atual",
      type: "Local",
      battery: "Bateria",
      accuracy: "Acurácia",
      date: "Data do sinal",
      lastAccuracy: "Última Acurácia",
      lastSignal: "Último sinal",
    };

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }
}

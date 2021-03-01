import { Component, OnInit } from "@angular/core";
import { ReportsService } from "app/servicos/index.service";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import * as moment from "moment-timezone";
import "jspdf";
import "jspdf-autotable";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CriticalAbsentModalComponent } from "./modal-position/layer.component";
import { PackingStatus } from "app/shared/pipes/packingStatus";

declare var jsPDF: any;

@Component({
  selector: "app-inventario-critico-ausencia",
  templateUrl: "./inventario-critico-ausencia.component.html",
  styleUrls: ["./inventario-critico-ausencia.component.css"],
})
export class InventarioCriticoAusencia implements OnInit {
  public actualListOfEvents: any[] = [];
  public originalListOfEvents: any[] = [];
  public actualPage: number = -1;
  public isLoading = true;

  public absentDays: number = 30;

  public eventType = {
    inbound: "Entrada",
    outbound: "Saída",
  };

  public reportAvailable: boolean = false;

  public packingStatus = new PackingStatus();

  constructor(
    private reportService: ReportsService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    //Loads the table headers
    this.loadTableHeaders();

    //Loads the data in the table
    this.reportService
      .getCriticalAbsent(this.absentDays)
      .subscribe((result: any[]) => {
        this.originalListOfEvents = result;

        this.actualListOfEvents = this.originalListOfEvents;

        this.setInitialCollapse(true);

        this.calculateFrequencyReport(this.actualListOfEvents);

        this.reportAvailable = true;
      });
  }

  applyFilter() {
    this.reportAvailable = false;
    this.originalListOfEvents = [];
    this.actualListOfEvents = [];

    this.reportService
      .getCriticalAbsent(this.absentDays)
      .subscribe((result: any[]) => {
        this.originalListOfEvents = result;

        this.actualListOfEvents = this.originalListOfEvents;

        this.setInitialCollapse(true);

        this.calculateFrequencyReport(this.actualListOfEvents);

        this.reportAvailable = true;
      });
  }

  searchEvent(event): void {
    const val = event.target.value.toLowerCase();
    const values = val.split(",").map((elem) => elem.trim());
    //["40823451", " LJ", " CEBRACE JACAREÍ"]

    // filter our data
    // const temp = this.originalListOfEvents.filter((item) => {
    //   return (
    //     item.family.toLowerCase().indexOf(val) !== -1 ||
    //     item.serial.toLowerCase().indexOf(val) !== -1 ||
    //     item.tag.toLowerCase().indexOf(val) !== -1 ||
    //     item.lastOwnerOrSupplier.toLowerCase().indexOf(val) !== -1 ||
    //     item.lastOwnerOrSupplierType.toLowerCase().indexOf(val) !== -1 ||
    //     item.actualCP.toLowerCase().indexOf(val) !== -1 ||
    //     !val
    //   );
    // });

    //Filtrando os resultados através de um array de palavras chave
    const temp = this.originalListOfEvents.filter((item) => {
      let result = true;
      values.forEach((elem) => {
        result =
          result &&
          (item.family.toLowerCase().indexOf(elem) !== -1 ||
            item.serial.toLowerCase().indexOf(elem) !== -1 ||
            item.tag.toLowerCase().indexOf(elem) !== -1 ||
            item.lastOwnerOrSupplier.toLowerCase().indexOf(elem) !== -1 ||
            item.lastOwnerOrSupplierType.toLowerCase().indexOf(elem) !== -1 ||
            item.actualCP.toLowerCase().indexOf(elem) !== -1 ||
            !elem);
      });

      return result;
    });

    // update the rows
    this.actualListOfEvents = temp;
    // Whenever the filter changes, always go back to the first page
    this.actualPage = 0;
  }

  public frequencyResult = [];
  calculateFrequencyReport(actualListOfEvents: any) {
    let auxFrequencyResult = {};
    this.frequencyResult = [];

    actualListOfEvents.forEach((actualPacking) => {
      actualPacking.eventList.forEach((element) => {
        if (!!element.control_point) {
          if (auxFrequencyResult[element.control_point.name] == undefined)
            auxFrequencyResult[element.control_point.name] = 1;
          else auxFrequencyResult[element.control_point.name]++;
        }
      });
    });

    Object.keys(auxFrequencyResult).forEach((element) => {
      this.frequencyResult.push({
        name: element,
        qtt: auxFrequencyResult[element],
      });
    });

    this.frequencyResult = this.frequencyResult.sort((a, b) => {
      if (a.qtt < b.qtt) {
        return 1;
      }
      if (a.qtt > b.qtt) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

  visualizeOnMap(item: any): void {
    const modalRef = this.modalService.open(CriticalAbsentModalComponent, {
      size: "lg",
      windowClass: "modal-xl",
    });
    modalRef.componentInstance.packing = {
      family: item.family,
      serial: item.serial,
      tag: item.tag,
      lastOwnerOrSupplier: item.lastOwnerOrSupplier,
      dateLastOwnerOrSupplier: item.dateLastOwnerOrSupplier,
      leaveMessage: item.leaveMessage,
    };
  }

  /**
   * Initial configuration of all collapses
   * @param  Initial state: true(collapsed) or false(expanded)
   */
  setInitialCollapse(state: boolean) {
    this.actualListOfEvents.map((element) => (element.isCollapsed = state));
  }

  convertTimezone(timestamp) {
    return moment
      .utc(timestamp)
      .tz("America/Sao_Paulo")
      .format("DD/MM/YYYY HH:mm:ss");
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
    this.headers.push({ label: "Família", name: "family" });
    this.headers.push({ label: "Serial", name: "serial" });
    this.headers.push({ label: "Tag", name: "tag" });

    this.headers.push({ label: "Tipo", name: "lastOwnerOrSupplierType" });
    this.headers.push({
      label: "Último Ponto de Controle",
      name: "lastOwnerOrSupplier",
    });
    this.headers.push({
      label: "Data da saída",
      name: "dateLastOwnerOrSupplier",
    });

    this.headers.push({
      label: "Local Atual",
      name: "actualCP",
    });
    this.headers.push({ label: "Data da entrada", name: "dateActualCP" });
    this.headers.push({
      label: "Status Atual",
      name: "status",
    });

    this.headers.push({ label: "Última mensagem", name: "lastMessage" });

    //console.log('this.headers: ' + JSON.stringify(this.headers));
  }

  headerClick(item: any) {
    this.sort.name = item.name;
    this.sort.order = this.sortStatus[
      (this.sortStatus.indexOf(this.sort.order) + 1) % 2
    ];

    // console.log('---');
    // console.log('this.sort: ' + JSON.stringify(this.sort));

    this.actualListOfEvents = this.customSort(
      this.actualListOfEvents,
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
    if (this.reportAvailable) {
      //Flat the json object to print
      //I'm using the method slice() just to copy the array as value.
      let flatObjectData = this.flatObject(this.actualListOfEvents.slice());

      //Add a header in the flat json data
      flatObjectData = this.addHeader(flatObjectData);

      //Instantiate a new csv object and initiate the download
      new Angular2Csv(
        flatObjectData,
        "relatorio-critico-de-ausencia",
        this.csvOptions
      );
    }
  }

  /**
   * Click to download pdf file
   */
  downloadPdf() {
    if (this.reportAvailable) {
      var doc = jsPDF("l", "pt");

      // You can use html:
      //doc.autoTable({ html: '#my-table' });

      //Flat the json object to print
      //I'm using the method slice() just to copy the array as value.
      let flatObjectData = this.flatObject(this.actualListOfEvents.slice());

      var columns = [
        { title: "Família", dataKey: "family" },
        { title: "Serial", dataKey: "serial" },
        { title: "Tag", dataKey: "tag" },
        { title: "Tipo", dataKey: "lastOwnerOrSupplier" },
        {
          title: "Último Ponto de Controle Próprio",
          dataKey: "lastOwnerOrSupplierType",
        },
        { title: "Data de Saída", dataKey: "leaveMessage" },
        { title: "Status Atual", dataKey: "status" },
        { title: "Última mensagem", dataKey: "lastMessage" },
        { title: "Evento", dataKey: "event" },
        { title: "Tipo de Evento", dataKey: "eventType" },
        { title: "Data do Evento", dataKey: "eventDate" },
      ];

      // Or JavaScript:
      doc.autoTable(columns, flatObjectData, {
        styles: {
          fontSize: 6,
        },
      });
      doc.save("critical_absent.pdf");
    }
  }

  flatObject(mArray: any) {
    //console.log(mArray);
    let result = [];

    let plainArray = mArray.map((element) => {
      if (element.eventList.length) {
        element.eventList.forEach((event) => {
          result.push({
            family: element.family,
            serial: element.serial,
            tag: element.tag,
            lastOwnerOrSupplier: element.lastOwnerOrSupplier,
            lastOwnerOrSupplierType: element.lastOwnerOrSupplierType,
            leaveMessage: this.convertTimezone(element.leaveMessage),
            status: this.packingStatus.transform(element.status),
            lastMessage: this.convertTimezone(element.lastMessage),
            event: event.control_point ? event.control_point.name : "-",
            eventType: event.type,
            eventDate: this.convertTimezone(event.created_at),
          });
        });
      } else {
        result.push({
          family: element.family,
          serial: element.serial,
          tag: element.tag,
          lastOwnerOrSupplier: element.lastOwnerOrSupplier,
          lastOwnerOrSupplierType: element.lastOwnerOrSupplierType,
          leaveMessage: this.convertTimezone(element.leaveMessage),
          status: this.packingStatus.transform(element.status),
          lastMessage: this.convertTimezone(element.lastMessage),
          event: "-",
          eventType: "-",
          eventDate: "-",
        });
      }
    });

    // As my array is already flat, I'm just returning it.
    return result;
  }

  addHeader(mArray: any) {
    let cabecalho = {
      family: "Família",
      serial: "Serial",
      tag: "Tag",
      lastOwnerOrSupplier: "Tipo",
      lastOwnerOrSupplierType: "Último Ponto de Controle",
      leaveMessage: "Data de Saída",
      status: "Status Atual",
      lastMessage: "Última mensagem",
      event: "Evento",
      eventType: "Tipo do Evento",
      eventDate: "Data do Evento",
    };

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }
}

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

  public eventType = {
    inbound: "Entrada",
    outbound: "Saída",
  };

  constructor(
    private reportService: ReportsService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.reportService.getCriticalAbsent().subscribe((result: any[]) => {
      this.originalListOfEvents = result;

      this.actualListOfEvents = this.originalListOfEvents;

      this.setInitialCollapse(true);

      this.calculateFrequencyReport(this.actualListOfEvents);
    });
  }

  public frequencyResult = [];
  calculateFrequencyReport(actualListOfEvents: any) {
    let auxFrequencyResult = {};

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

    this.frequencyResult = this.frequencyResult.sort((a, b)=>{
      if (a.qtt < b.qtt) {
        return 1;
      }
      if (a.qtt > b.qtt) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })
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
    if (timestamp.toString().length == 10) timestamp *= 1000;

    return moment
      .utc(timestamp)
      .tz("America/Sao_Paulo")
      .format("DD/MM/YYYY HH:mm:ss");
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
    let flatObjectData = this.flatObject(this.actualListOfEvents.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, "Inventario Posições", this.csvOptions);
  }

  /**
   * Click to download pdf file
   */
  downloadPdf() {
    var doc = jsPDF("l", "pt");

    // You can use html:
    //doc.autoTable({ html: '#my-table' });

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.actualListOfEvents.slice());
    flatObjectData = flatObjectData.map((elem) => {
      return [elem.a1, elem.a2, elem.a3, elem.a4, elem.a5];
    });
    // console.log(flatObjectData);

    // Or JavaScript:
    doc.autoTable({
      head: [["Tag", "Acurácia", "Latitude", "Longitude", "Data da mensagem"]],
      body: flatObjectData,
    });

    doc.save("general.pdf");
  }

  flatObject(mArray: any) {
    //console.log(mArray);
    let plainArray = mArray.map((obj) => {
      return {
        a1: obj.tag,
        a2: obj.accuracy,
        a3: obj.latitude,
        a4: obj.longitude,
        a5: this.convertTimezone(obj.timestamp),
      };
    });

    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any) {
    let cabecalho = {
      a1: "Tag",
      a2: "Acurácia",
      a3: "Latitude",
      a4: "Longitude",
      a5: "Data da mensagem",
    };

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }
}

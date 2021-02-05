import { Component, OnInit } from "@angular/core";
import {
  FamiliesService,
  PositionsService,
  PackingService,
  ReportsService,
} from "app/servicos/index.service";
import {
  DatepickerModule,
  BsDatepickerModule,
  BsDaterangepickerConfig,
  BsLocaleService,
} from "ngx-bootstrap/datepicker";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NouiFormatter } from "ng2-nouislider";
import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import * as moment from "moment-timezone";
import "jspdf";
import "jspdf-autotable";
import { DatePipe } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CriticalAbsentModalComponent } from "./modal-position/layer.component";
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
    // this.reportService.getCriticalAbsent().subscribe((result: any[]) => {
    // this.originalListOfEvents = result;
    this.originalListOfEvents = [
      {
        family: "LTR6",
        serial: "0629 J",
        tag: "4081100",
        lastOwnerOrSupplier: "CEBRACE BARRA VELHA",
        lastOwnerOrSupplierType: "FABRICA",
        dateLastOwnerOrSupplier: "2021-01-05T22:55:03.842Z",
        actualCP: "PILKINGTON - CAÇAPAVA",
        dateActualCP: "2021-01-12T06:29:03.623Z",
        status: "local_correto",
        lastMessage: "2021-01-13T02:27:44.000Z",
        eventList: [
          {
            control_point: {
              _id: "5c17c53162c3a61cba96b6ee",
              name: "PILKINGTON - CAÇAPAVA",
            },
            created_at: "2021-01-12T06:29:03.623Z",
            type: "inbound",
            device_data_id: "5ffd3ed6a3c9840023720e4f",
          },
          {
            control_point: {
              _id: "5c17c53162c3a61cba96b69e",
              name: "THERMOGLASS - GUARULHOS",
            },
            created_at: "2021-01-07T20:56:04.377Z",
            type: "outbound",
            device_data_id: "5ff77468a3c98400235f2281",
          },
          {
            control_point: {
              _id: "5c17c53162c3a61cba96b69e",
              name: "THERMOGLASS - GUARULHOS",
            },
            created_at: "2021-01-06T20:30:03.952Z",
            type: "inbound",
            device_data_id: "5ff61cd1a3c98400235acecc",
          },
        ],
      },
      {
        family: "LJ",
        serial: "0588 C",
        tag: "4084664",
        lastOwnerOrSupplier: "CEBRACE BARRA VELHA",
        lastOwnerOrSupplierType: "FABRICA",
        dateLastOwnerOrSupplier: "2020-11-26T11:43:03.757Z",
        actualCP: "-",
        dateActualCP: "",
        status: "viagem_em_prazo",
        lastMessage: "2021-01-12T22:19:48.000Z",
        eventList: [
          {
            control_point: {
              _id: "5c17c53162c3a61cba96b6d7",
              name: "GLASS HOUSE - PIEN",
            },
            created_at: "2021-01-12T07:37:03.665Z",
            type: "outbound",
            device_data_id: "5ffd4e8aa3c98400237242a1",
          },
          {
            control_point: {
              _id: "5c17c53162c3a61cba96b6d7",
              name: "GLASS HOUSE - PIEN",
            },
            created_at: "2020-12-29T08:09:03.423Z",
            type: "inbound",
            device_data_id: "5feadf2ea3c984002331a3b7",
          },
          {
            control_point: {
              _id: "5c17c53162c3a61cba96b69e",
              name: "THERMOGLASS - GUARULHOS",
            },
            created_at: "2020-12-29T07:52:04.156Z",
            type: "outbound",
            device_data_id: "5feadf2ea3c984002331a3b7",
          },
          {
            control_point: {
              _id: "5c17c53162c3a61cba96b6d7",
              name: "GLASS HOUSE - PIEN",
            },
            created_at: "2020-12-29T07:52:04.156Z",
            type: "inbound",
            device_data_id: "5feadf2ea3c984002331a3b7",
          },
          {
            control_point: {
              _id: "5c17c53162c3a61cba96b69e",
              name: "THERMOGLASS - GUARULHOS",
            },
            created_at: "2020-12-24T00:11:03.554Z",
            type: "inbound",
            device_data_id: "5fe3d907a3c984002316318e",
          },
          {
            control_point: {
              _id: "5c17c53162c3a61cba96b6ee",
              name: "PILKINGTON - CAÇAPAVA",
            },
            created_at: "2020-12-23T16:38:03.620Z",
            type: "outbound",
            device_data_id: "5fe370b9a3c9840023149272",
          },
          {
            control_point: {
              _id: "5c17c53162c3a61cba96b6ee",
              name: "PILKINGTON - CAÇAPAVA",
            },
            created_at: "2020-11-30T03:08:03.361Z",
            type: "inbound",
            device_data_id: "5fc461bf70acbe00271f2097",
          },
        ],
      },
    ];
    this.actualListOfEvents = this.originalListOfEvents;

    this.setInitialCollapse(true);

    this.calculateFrequencyReport(this.actualListOfEvents);
    // });
  }

  public frequencyResult = [];
  calculateFrequencyReport(actualListOfEvents: any) {
    let auxFrequencyResult = {};

    actualListOfEvents.forEach((actualPacking) => {
      actualPacking.eventList.forEach((element) => {
        if (auxFrequencyResult[element.control_point.name] == undefined)
          auxFrequencyResult[element.control_point.name] = 1;
        else auxFrequencyResult[element.control_point.name]++;
      });
    });

    Object.keys(auxFrequencyResult).forEach((element) => {
      this.frequencyResult.push({
        name: element,
        qtt: auxFrequencyResult[element],
      });
    });

    console.log(this.frequencyResult);
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

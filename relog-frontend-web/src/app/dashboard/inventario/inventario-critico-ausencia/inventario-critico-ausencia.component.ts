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

  constructor(private reportService: ReportsService) {}

  ngOnInit() {
    this.reportService.getCriticalAbsent().subscribe((result: any[]) => {
      this.originalListOfEvents = result;
      this.actualListOfEvents = this.originalListOfEvents;
    });
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

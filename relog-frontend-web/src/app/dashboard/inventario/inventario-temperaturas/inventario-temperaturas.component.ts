import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import {
  FamiliesService,
  PositionsService,
  RackService,
  TemperaturesService,
} from "app/servicos/index.service";
import {
  DatepickerModule,
  BsDatepickerModule,
  BsDaterangepickerConfig,
  BsLocaleService,
} from "ngx-bootstrap/datepicker";
import { NouiFormatter } from "ng2-nouislider";
import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import * as moment from "moment-timezone";
import "jspdf";
import "jspdf-autotable";
import { DatePipe } from "@angular/common";
declare var jsPDF: any;
declare var Plotly: any;

@Component({
  selector: "app-inventario-temperaturas",
  templateUrl: "./inventario-temperaturas.component.html",
  styleUrls: ["./inventario-temperaturas.component.css"],
})
export class InventarioTemperaturasComponent implements OnInit {
  public actualListOfTemperatures: any[] = [];
  public originalListOfTemperatures: any[] = [];

  public listOfFamilies: any[] = [];
  public selectedFamily: any = null;

  public listOfSerials: any[] = [];
  public _listOfSerials: any[] = [];

  public selectedSerial: any = null;

  public actualPage: number = -1;

  public isLoading = true;

  public withTemperature = false;

  @ViewChild("Graph")
  private Graph: ElementRef;

  /*
   * DataPicker
   */
  // datePickerConfig = new BsDaterangepickerConfig(); //Configurations
  public initialDate: Date; //Initial date
  public finalDate: Date; //Initial date

  dateModel: Date = new Date(); 

  constructor(
    private familyService: FamiliesService,
    private rackService: RackService,
    private temperatureService: TemperaturesService,
    private localeService: BsLocaleService
  ) {
    this.configureDatePicker();

    // console.log(this.initialDate);
    // console.log(this.finalDate);
  }

  configureDatePicker() {
    defineLocale("pt-br", ptBrLocale);
    this.localeService.use("pt-br");

    //Initialize 7 days before now
    let sub = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
    this.initialDate = new Date(sub);
    this.finalDate = new Date();

    // this.datePickerConfig.showWeekNumbers = false;
    // this.datePickerConfig.displayMonths = 1;
    // this.datePickerConfig.containerClass = "theme-dark-blue";
  }
  ngOnInit() {
    //Loading the families
    this.loadFamilies();

    //Loading the serials
    this.loadSerials();
  }

  ngAfterViewInit() {}

  /**
   * Loading the families
   */
  loadFamilies() {
    this.familyService.getAllFamilies().subscribe(
      (result) => {
        this.listOfFamilies = result;
      },
      (err) => console.error(err)
    );
  }

  /**
   * Carregar todos os pacotes com paginação e sem filtro
   */
  loadSerials(): void {
    this.rackService.getAllRacks().subscribe(
      (result) => {
        this.listOfSerials = result;
        this._listOfSerials = result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * A family was selected
   */
  familyFilter(event: any) {
    //console.log(this.selectedFamily);

    if (!this.selectedFamily) {
      this.selectedFamily = null;

      this.selectedSerial = null;
      this.listOfSerials = [];
      return;
    }

    this.serialFilter(this.selectedFamily);
  }

  /**
   * A serial was selected
   */
  serialFilter(family: any) {
    //console.log(this.selectedSerial);

    if (!family) {
      this.selectedSerial = null;
      this.familyFilter(this.selectedFamily);
      this.originalListOfTemperatures = [];
      return;
    }

    this.listOfSerials = this._listOfSerials.filter((elem) => {
      return elem.family.code == family.code;
    });

    if (this.initialDate !== null && this.finalDate !== null) {
      this.isLoading = true;
      let initialD = this.formatDate(this.initialDate);
      let finalD = this.formatDate(this.finalDate, true);

      // console.log(initialD);
      // console.log(finalD);

      if (this.selectedSerial)
        this.getFilteredTemperatures(
          this.selectedSerial.tag.code,
          initialD,
          finalD
        );
    }
  }

  /**
   * Get the package positions with the filter applied
   * @param codeTag Device tag code
   * @param startDate Date on format yyyy--mm-dd
   * @param finalDate Date on format yyyy--mm-dd
   * @param accuracy Integer value in meters (m)
   */
  getFilteredTemperatures(
    codeTag: string,
    startDate: any = null,
    finalDate: any = null
  ) {
    this.temperatureService
      .getFilteredTemperatures(codeTag, startDate, finalDate)
      .subscribe((result: any[]) => {
        // console.log(result);
        this.originalListOfTemperatures = result;
        this.createGraph(result);
        this.actualListOfTemperatures = this.originalListOfTemperatures;
      });
  }
 
  /**
   * Util date selector
   */
  onFirstDateChange(_newDate: string) {
    // console.log(_newDate);
    // console.log(newDate.getTime());
    // console.log(this.initialDate);

    let newDate = new Date(_newDate); 

    if (newDate !== null && this.finalDate !== null) {
      this.isLoading = true;
      let initialD = this.formatDate(newDate);
      let finalD = this.formatDate(this.finalDate, true);

      // console.log(initialD);
      // console.log(finalD);

      if (this.selectedSerial)
        this.getFilteredTemperatures(
          this.selectedSerial.tag.code,
          initialD,
          finalD
        );
    }
  }

  onFinalDateChange(_newDate: string) {
    // console.log(_newDate);
    // console.log(newDate.getTime());
    // console.log(this.initialDate);

    let newDate = new Date(_newDate); 

    if (this.initialDate !== null && newDate !== null) {
      this.isLoading = true;
      let initialD = this.formatDate(this.initialDate);
      let finalD = this.formatDate(newDate, true);

      // console.log(initialD);
      // console.log(finalD);

      if (this.selectedSerial)
        this.getFilteredTemperatures(
          this.selectedSerial.tag.code,
          initialD,
          finalD
        );
    }
  }

  formatDate(date: any, endDate: boolean = false) {
    // console.log(endDate);
    // console.log(date);

    // let d = date;
    // let result = 0;

    // if (!endDate) {
    //   d.setHours(0, 0, 0, 0);
    //   //d = new Date(d.getTime() + d.getTimezoneOffset() * 60000); //offset to user timezone
    //   result = d.getTime() / 1000;
    // } else {
    //   d.setHours(23, 59, 59, 0);
    //   //d = new Date(d.getTime() + d.getTimezoneOffset() * 60000); //offset to user timezone
    //   result = d.getTime() / 1000;
    // }

    // console.log(d);
    // console.log(result);

    return new Date(date).getTime()/1000;
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
    let flatObjectData = this.flatObject(this.actualListOfTemperatures.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, "Inventario temperaturas", this.csvOptions);
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
    let flatObjectData = this.flatObject(this.actualListOfTemperatures.slice());
    flatObjectData = flatObjectData.map((elem) => {
      return [elem.a1, elem.a2, elem.a3];
    });
    // console.log(flatObjectData);

    // Or JavaScript:
    doc.autoTable({
      head: [["Tag", "Valor", "Data da mensagem"]],
      body: flatObjectData,
    });

    doc.save("general.pdf");
  }

  flatObject(mArray: any) {
    //console.log(mArray);
    let plainArray = mArray.map((obj) => {
      return {
        a1: obj.tag,
        a2: obj.value.toFixed(2),
        a3: this.convertTimezone(obj.timestamp),
      };
    });

    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any) {
    let cabecalho = {
      a1: "Tag",
      a2: "Valor",
      a3: "Data da mensagem",
    };

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }

  createGraph(mArray: any) {
    let flatted = this.flatObject(mArray);

    let trace = {
      x: [],
      y: [],
      mode: "lines+markers",
      connectgaps: true,
    };
    // console.log(flatted);
    flatted.forEach((element) => {
      trace.x.unshift(element.a3);
      trace.y.unshift(element.a2);
    });

    var data = [trace];

    Plotly.newPlot(
      this.Graph.nativeElement, //our viewchild element
      data, //data provided
      {
        //here starts the layout definition (keep in mind the commas)
        autoexpand: "true",
        autosize: "true",
        //width: "100%", //window.innerWidth - 200, //we give initial width, so if the
        //graph is rendered while hidden, it
        //takes the right shape
        margin: {
          // autoexpand: "true",
          margin: 0,
        },
        offset: 0,
        type: "scattergl", 
        hovermode: "closest",
        title: "Histórico de temperaturas",
        xaxis: {
          linecolor: "black",
          linewidth: 1,
          mirror: true,
          title: "Hora da Aferição",
          automargin: true,
        },
        yaxis: {
          linecolor: "black",
          linewidth: 1,
          mirror: true,
          automargin: true,
          title: "Temperatura (°C)",
        },
      },
      {
        //this is where the configuration is defined
        responsive: true, //important to keep graph responsive
        scrollZoom: true,
        toImageButtonOptions: {
          format: 'png', // one of png, svg, jpeg, webp
          filename: 'temperature_chart', 
          scale: 2 // Multiply title/legend/axis/canvas sizes by this factor
        }
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { FamiliesService, DevicesService, PackingService } from 'app/servicos/index.service';
import { DatepickerModule, BsDatepickerModule, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NouiFormatter } from 'ng2-nouislider';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import 'jspdf';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
declare var jsPDF: any;

@Component({
  selector: 'app-inventario-posicoes',
  templateUrl: './inventario-posicoes.component.html',
  styleUrls: ['./inventario-posicoes.component.css']
})
export class InventarioPosicoesComponent implements OnInit {

  public listOfPositions: any[] = [];
  public auxListOfPositions: any[] = [];

  public listOfFamilies: any[] = [];
  public selectedFamily: any = null;

  public listOfSerials: any[] = [];
  public _listOfSerials: any[] = [];

  public selectedSerial: any = null;

  public actualPage: number = -1;

  public isLoading = true;

  /*
   * DataPicker
   */
  datePickerConfig = new BsDaterangepickerConfig(); //Configurations
  public initialDate: Date;  //Initial date
  public finalDate: Date;    //Initial date
  
  constructor(private familyService: FamiliesService,
    private packingService: PackingService,
    private deviceService: DevicesService,
    private localeService: BsLocaleService) {

    this.configureDatePicker();

    console.log(this.initialDate);
    console.log(this.finalDate);
  }

  configureDatePicker(){
    defineLocale('pt-br', ptBrLocale);
    this.localeService.use('pt-br');

    //Initialize 7 days before now
    let sub = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
    this.initialDate = new Date(sub);
    this.finalDate = new Date();

    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.displayMonths = 1;
    this.datePickerConfig.containerClass = 'theme-dark-blue';  
  }
  ngOnInit() {

    //Loading the families
    this.loadFamilies();

    //Loading the serials
    this.loadSerials();
  }

  /**
   * Loading the families
   */
  loadFamilies() {
    this.familyService.getAllFamilies().subscribe(result => {

      this.listOfFamilies = result;
    }, err => console.error(err));
  }

  /**
   * Carregar todos os pacotes com paginação e sem filtro
   */
  loadSerials(): void {

    this.packingService.getAllPackings().subscribe(result => {

      this.listOfSerials = result;
      this._listOfSerials = result;

    }, err => { console.log(err) });
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
      this.listOfPositions = [];
      return;
    }

    this.listOfSerials = this._listOfSerials.filter(elem => {
      return elem.family.code == family.code;
    });

    if (this.initialDate !== null && this.finalDate !== null) {

      this.isLoading = true;
      let initialD = this.formatDate(this.initialDate);
      let finalD = this.formatDate(this.finalDate, true);

      console.log(initialD);
      console.log(finalD);

      if (this.selectedSerial)
        this.getFilteredPositions(this.selectedSerial.tag.code, initialD, finalD, 32000);
    }
  }

  /**
   * Get the package positions with the filter applied
   * @param codeTag Device tag code
   * @param startDate Date on format yyyy--mm-dd
   * @param finalDate Date on format yyyy--mm-dd
   * @param accuracy Integer value in meters (m)
   */
  getFilteredPositions(codeTag: string, startDate: any = null, finalDate: any = null, accuracy: any = null) {

    this.deviceService.getFilteredPositions(codeTag, startDate, finalDate, accuracy).subscribe((result: any[]) => {
      //console.log(result);
      this.listOfPositions = result;
    });
  }

  /**
   * Util date selector
   */
  onFirstDateChange(newDate: Date) {

    // console.log(newDate);
    // console.log(newDate.getTime());
    // console.log(this.initialDate);

    if (newDate !== null && this.finalDate !== null) {

      this.isLoading = true;
      let initialD = this.formatDate(newDate);
      let finalD = this.formatDate(this.finalDate, true);

      // console.log(initialD);
      // console.log(finalD);

      if (this.selectedSerial)
        this.getFilteredPositions(this.selectedSerial.tag.code, initialD, finalD, 32000);
    }
  }

  onFinalDateChange(newDate: Date) {

    // console.log(newDate);
    // console.log(newDate.getTime());
    // console.log(this.initialDate);

    if (this.initialDate !== null && newDate !== null) {

      this.isLoading = true;
      let initialD = this.formatDate(this.initialDate);
      let finalD = this.formatDate(newDate, true);

      // console.log(initialD);
      // console.log(finalD);

      if (this.selectedSerial)
        this.getFilteredPositions(this.selectedSerial.tag.code, initialD, finalD, 32000);
    }
  }

  formatDate(date: any, endDate: boolean = false) {
    
    // console.log(endDate);
    // console.log(date);

    let d = date;
    let result = 0;

    if (!endDate) {
      d.setHours(0, 0, 0, 0);
      //d = new Date(d.getTime() + d.getTimezoneOffset() * 60000); //offset to user timezone
      result = d.getTime() / 1000;

    } else {
      d.setHours(23, 59, 59, 0);
      //d = new Date(d.getTime() + d.getTimezoneOffset() * 60000); //offset to user timezone
      result = d.getTime()/1000;
    }
    
    // console.log(d);
    // console.log(result);

    return result;
  }
  
// formatDate(date: any, endDate: boolean = false) {
    
//     console.log(endDate);
//     console.log(date);
//     let d = new Date(date.getTime() + date.getTimezoneOffset() * 60000); //offset to user timezone
//     console.log(d);

//     let month = '' + (d.getMonth() + 1);
//     let day = '' + (d.getDate());
//     let year = d.getFullYear();

//     if (month.length < 2) month = '0' + month;
//     if (day.length < 2) day = '0' + day;

//     //[year, month, day].join('-');
//     //console.log(endDate); 

//     let result = '';

//     if (endDate) 
//       result = `${year}-${month}-${day}T23:59:59Z`;
//     else
//       result = `${year}-${month}-${day}T00:00:00Z`;

//     console.log(result);

//     return result;
//   }

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
  downloadCsv() {

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.listOfPositions.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, 'Inventario Posições', this.csvOptions);
  }

  /**
   * Click to download pdf file
   */
  downloadPdf() {
    var doc = jsPDF('l', 'pt');

    // You can use html:
    //doc.autoTable({ html: '#my-table' });

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.listOfPositions.slice());
    flatObjectData = flatObjectData.map(elem => {
      return [elem.a1, elem.a2, elem.a3, elem.a4, elem.a5, elem.a6, elem.a7];
    });
    // console.log(flatObjectData);

    // Or JavaScript:
    doc.autoTable({
      head: [['Acurácia', 'Bateria', 'Latitude', 'Longitude', 'Data da mensagem', '# Sequência', 'Temperatura']],
      body: flatObjectData
    });

    doc.save('general.pdf');
  }

  flatObject(mArray: any) {

    //console.log(mArray);    
    let plainArray = mArray.map(obj => {

      let d = new Date(obj.message_date),
        day = '' + (d.getDate()),  
        month = '' + (d.getMonth() + 1),
        year = d.getFullYear(),
        hour = d.getHours(),
        minute = d.getMinutes(),
        second = d.getSeconds();
        
      return {
        a1: obj.accuracy,
        a2: (obj.battery.percentage == null) ? '-' : obj.battery.percentage,
        a3: obj.latitude,
        a4: obj.longitude,
        //a5: obj.message_date,
        a5: `${day}/${month}/${year} ${hour}:${minute}:${second}`,
        a6: obj.seq_number,
        a7: (obj.temperature == null) ? '-' : obj.temperature
      };
    });

    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any) {
    let cabecalho = {
      a1: 'Acurácia',
      a2: 'Bateria',
      a3: 'Latitude',
      a4: 'Longitude',
      a5: 'Data da mensagem',
      a6: '# Sequência',
      a7: 'Temperatura',
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }

}

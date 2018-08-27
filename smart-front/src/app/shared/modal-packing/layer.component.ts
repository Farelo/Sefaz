import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PackingService, PlantsService, LogisticService, SuppliersService, SettingsService, AlertsService} from '../../servicos/index.service';
import { DatepickerModule, BsDatepickerModule, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { MeterFormatter } from '../pipes/meter_formatter';
import { NouiFormatter } from 'ng2-nouislider';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
defineLocale('pt-br', ptBrLocale); 

@Component({
  selector: 'app-alerta',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerModalComponent implements OnInit {

  //Show package details
  public detailsIsCollapsed = true;
  public message = '';

  /*
   * DataPicker
   */
  datePickerConfig = new BsDaterangepickerConfig(); //Configurations
  public initialDate: Date;  //Initial date
  public finalDate: Date;    //Initial date

  /*
   * Accuracy
   */
  public accuracyRange: any = 1000;
  incrementRange(){
    this.accuracyRange = parseInt(this.accuracyRange) + 10;
    this.rangechanged();
  }

  decrementRange() {
    this.accuracyRange = parseInt(this.accuracyRange) - 10;
    this.rangechanged();
  }

  rangechanged(){
    console.log('rangechanged');

    this.updatePaths();
    // this.getLastPostition();
  }

  @Input() packing;
  public path = [];
  public center: any;
  public markers = [];
  public marker = {
    display: true,
    lat: null,
    lng: null,
    start: null,
    end: null,
    battery: null,
    accuracy: null
  };
  public lastPosition: any;

  public plants = [];
  public plant = {
    display: true,
    lat: null,
    lng: null,
    name: null,
    location: null
  };

  public logistics = [];
  public logistic = {
    display: true,
    name: null
  }

  public suppliers = [];
  supplier = {
    display: true,
    name: null,
    lat: null,
    lng: null,
  };

  public settings: any;

  public showLastPosition: boolean = false;

  public showControlledPlants: boolean = true;
  toggleShowControlledPlants(){
    this.showControlledPlants = !this.showControlledPlants;
  }

  constructor(
    public activeLayer: NgbActiveModal,
    private plantsService: PlantsService,
    private logisticService: LogisticService,
    private supplierService: SuppliersService,
    private packingService: PackingService,
    private settingsService: SettingsService,
    private alertService: AlertsService,
    private localeService: BsLocaleService) {

      defineLocale('pt-br', ptBrLocale);
      this.localeService.use('pt-br');

      //Initialize 7 days before now
      let sub = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
      this.initialDate = new Date(sub);
      this.finalDate = new Date();

      this.datePickerConfig.showWeekNumbers = false;
      this.datePickerConfig.displayMonths = 1;
      this.datePickerConfig.containerClass = 'theme-dark-blue';
      //this.datePickerConfig.locale = 'pt-br';
  }

  ngOnInit() {
    
    //console.log('ngOnInit');
    console.log('[layer.component] this.packing: ' + JSON.stringify(this.packing));

    //this.getPositions();
    this.getPlantRadius();
    this.getFilteredPositions(this.packing.code_tag, this.initialDate.getTime(), this.finalDate.getTime(), 32000);
    this.getPlants();
    this.getSuppliers();
    this.getAlert();
  }
  
  /**
   * If the user came from Alert screen, then the packing.alertCode contains the alert status code.
   * If not, trye to retrieve an existing alert status code.
   */
  getAlert(){
    
    if (this.packing.alertCode == undefined) {
      this.alertService.retrievePackingAlert(this.packing._id).subscribe(response => {
        
        //console.log('response.data: ' + JSON.stringify(response.data));

        if (response.data.length > 0) {
          let result = response.data[0];
          this.packing.alertCode = result.status;

        } else {
          this.packing.alertCode = 0;
        }
      })
      
    }
  }

  getPlantRadius(){
    this.settingsService.retrieve().subscribe(response => {
      let result = response.data[0];
      this.settings = result;
      this.settings.range_radius = this.settings.range_radius*1000;
      //console.log('this.settings: ' + JSON.stringify(this.settings));
    })
  }

  onFirstDateChange(newDate: Date) { 
    if (newDate !== null && this.finalDate !== null ){
      newDate.setHours(0, 0, 0, 0);
      this.getFilteredPositions(this.packing.code_tag, newDate.getTime(), this.finalDate.getTime(), 32000);
    }
  }

  onFinalDateChange(newDate: Date) { 
    //console.log('onFinalDateChange');

    if (this.initialDate !== null && newDate !== null )
      this.getFilteredPositions(this.packing.code_tag, this.initialDate.getTime(), newDate.getTime(), 32000);
  }
  

  /**
   * Get the package positions with the filter applied
   */
  getFilteredPositions(codeTag: string, startDate: any, finalDate: any, accuracy: any){

    let normalizeStartDate = new Date(startDate);
    normalizeStartDate.setHours(0, 0, 0, 0);

    let normalizeEndDate = new Date(finalDate);
    normalizeEndDate.setHours(23, 59, 59, 0);

    console.log('[getFilteredPositions] codeTag, startDate, finalDate: ' + codeTag + ", " + normalizeStartDate.getTime() + ", " + normalizeEndDate.getTime());

    this.packingService.getFilteredPositions(codeTag, normalizeStartDate.getTime(), normalizeEndDate.getTime()).subscribe(result => {
      // this.generciService.getPackAlert(`${codeTag}`).subscribe(alert => this.currentPackingAlert = alert)
      this.center = result.data.positions[0];
      //this.path = result.data.positions;
      this.markers = result.data.markers;

      this.markers.map((elem, index) => { 
        elem.latLng = new google.maps.LatLng(elem.position[0], elem.position[1]);
        return elem;
      })

      this.updatePaths();
      // this.getLastPostition();

      // console.log('[getFilteredPositions] result: ' + JSON.stringify(result));
      // console.log('[getFilteredPositions] path: ' + JSON.stringify(this.path));
      // console.log('[getFilteredPositions] markers: ' + JSON.stringify(this.markers));
      // console.log('lastPosition: ' + JSON.stringify(this.lastPosition));
    })
  }

  /*
 * Plants
 */
  getPlants() {
    this.plantsService.retrieveAll().subscribe(result => {
      this.plants = result.data;

      this.plants.map(e => {
        //e.position = [e.lat, e.lng];
        //e.position = [e.lat, e.lng];
        e.latLng = new google.maps.LatLng(e.lat, e.lng);
        return e;
      })

      console.log('plants: ' + JSON.stringify(this.plants));
    })
  }

  /*
   * Logistic operator
   */
  getLogisticOperators() {
    this.logisticService.listLogistic(99999, 1).subscribe(result => {
      this.logistics = result.data;

      // this.logistics.map(e => {
      //   //e.position = [e.lat, e.lng];
      //   //e.position = [e.lat, e.lng];
      //   e.latLng = new google.maps.LatLng(e.lat, e.lng);
      //   return e;
      // })
      //console.log('logistics: ' + JSON.stringify(this.logistics));
    })
  }

  getSuppliers(){
    this.supplierService.retrieveAll().subscribe(result => {
      this.suppliers = result.data;

      this.suppliers.map(e => { 
        e.latLng = new google.maps.LatLng(e.plant.lat, e.plant.lng);
        return e;
      })
      //console.log('suppliers: ' + JSON.stringify(this.suppliers));
    })
  }

  clicked(_a, opt) {
    var marker = _a.target; 
    
    this.marker.lat = marker.getPosition().lat();
    this.marker.lng = marker.getPosition().lng();
    this.marker.start = opt.start;
    this.marker.battery = opt.battery;
    this.marker.end = opt.end;
    this.marker.accuracy = opt.accuracy;

    this.startWindow(marker);
  }

  clickedPlant(_a, opt) {
    var p = _a.target;
    this.plant.lat = p.lat;
    this.plant.lng = p.lng;
    this.plant.name = opt.plant_name;
    this.plant.location = opt.location;

    this.clickedPlantDetail(p);
  }

  clickedSupplier(_a, opt){
    var s = _a.target;
    //console.log('opt: ' + JSON.stringify(opt));

    this.supplier.lat = opt.plant.lat;
    this.supplier.lng = opt.plant.lng;
    this.supplier.name = opt.plant.plant_name;

    this.clickedSupplierDetail(s);
  }

  /*
   * Info window 
   */
  clickedPlantDetail(plant) {
    plant.nguiMapComponent.openInfoWindow('pw', plant);
    var iwOuter = $('.gm-style-iw');
    var iwBackground = iwOuter.prev();
    iwBackground.css({ 'border': '1px solid #000' });
    iwBackground.css({ 'background-color': 'red' });
    iwBackground.children(':nth-child(3)').css({ 'z-index': '1' });
    iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
    iwOuter.children(':nth-child(1)').css({ 'box-shadow': 'rgba(0, 0, 0, 0.6) 0px 1px 6px' });
    iwOuter.children(':nth-child(1)').css({ 'background-color': 'white' });
    var iwCloseBtn = iwOuter.next();
    var altura = $('.iw-title').height();
    var iwDiv = $('.iw-title').next();
    iwDiv.css({ 'padding': '10px' });

    iwCloseBtn.css({
      opacity: '0.5',
      top: '38px',
      right: '57px'
    });
    iwOuter.next().next().css({ 'top': '15px', right: '44px' })
    iwCloseBtn.css({ 'background-color': 'red' });
    iwCloseBtn.css({ 'background': 'url(data:image/png;base64,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) no-repeat left center' });
    iwCloseBtn.css({ 'background-size': '13px' });
    iwCloseBtn.children(':nth-child(1)').css({ 'display': 'none' });
    iwCloseBtn.mouseout(function () {
      $(this).css({ opacity: '0.5' });
    });
  }

  clickedSupplierDetail(supply) {
    supply.nguiMapComponent.openInfoWindow('sw', supply);
    var iwOuter = $('.gm-style-iw');
    var iwBackground = iwOuter.prev();
    iwBackground.css({ 'border': '1px solid #000' });
    iwBackground.css({ 'background-color': 'red' });
    iwBackground.children(':nth-child(3)').css({ 'z-index': '1' });
    iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
    iwOuter.children(':nth-child(1)').css({ 'box-shadow': 'rgba(0, 0, 0, 0.6) 0px 1px 6px' });
    iwOuter.children(':nth-child(1)').css({ 'background-color': 'white' });
    var iwCloseBtn = iwOuter.next();
    var altura = $('.iw-title').height();
    var iwDiv = $('.iw-title').next();
    iwDiv.css({ 'padding': '10px' });

    iwCloseBtn.css({
      opacity: '0.5',
      top: '20px !important',
      right: '20px !important'
    });
    iwOuter.next().next().css({ 'top': '15px', right: '44px' })
    iwCloseBtn.css({ 'background-color': 'red' });
    iwCloseBtn.css({ 'background': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAP00lEQVR42u3dP6ilZ4HH8e8cbjFFihFGuNspTqFgoZAFgxYBlRF2AlMkxUKKKbQQdHFwt5BlWdzVwiph2SKgsIVChFgIE1gVwYgBIxZJEVDYCaYY2IG9sFNMMcWFu8Vz3n3f58w59/x73/f59/1AGGbuJPedCb/vfc6558+Vi4sLRvKF5T+fAE6B68sfAc6Ah8sfPwDeAt4Bzsf65FLhngW+RNhPt53hfroNfUDYzluMsJ8rRwTgKnAbuAncWl70Ph4BbwK/BH4GPBnrb1IqwAnxfk73/Pcf0+/n54Q97e2QAJwAd4B/PeCiN3kI/AD4dzwVqH53gH8Eboz033tE2M+r7PmFdJ8AnAAvj3zhq+4D3wd+giFQfW4D/wx8ZqL/fveF9DV2DMGuAbgGvEG4jTKHXwMvceCxRsrMVeCHhC+gc3gPeAF4sO037hKATwL3mO6r/ib3l3+IP8/8eaUxnRL28+zMn/ch4Yvo25f9psWW/8gt4I/MP36Wn/OPy2uQSvQ54F3mHz+E8PwG+Oplv+myE8AtQrlSOwf+lvCdAqkULwKvE+47S+3rhPsFnrIpAJ8kfPV9JvWVLxkBlSSn8UPYz5cJjx2IrAvANdId+7f9IYyAcpfb+DtnwF8DHw5/cfU+gBPCvf25jb+7ttcJf8FSjnIdP4QH6t1j5VS/GoCXme9bfYcwAspVzuPvfBr4h+EvDG8CnAB/Is+v/qu8OaCclDD+ziPg48sfoxPAHcoYP3gSUD5KGj+E+/i+3f2kOwFcBf7CeI/tn4snAaVU2vg7TwingIfdCeA25Y0fPAkonVLHD+EL/h3obwLcTH1FRzACmlvJ4+/chP4mwP+w//P5c+PNAc2hhvFD2MtHF4RX8Sl9/OBJQNOrZfws/wy3ugDUwghoKjWNv/P5BeE1yGpiBDS2GscPcGNBmff+b2MENJZaxw9wuqCO2//rGAEdq+bxA1yv9QTQMQI6VO3jh+UJoHZGQPtqYfxAeCDQWeqLmIER0K6aGT9wtiC8eGALjIC2aWn8sHwuQAsngI4R0CatjR+WJ4APUl/FzIyAVrU4foD7C9a8UGADjIA6rY4f4LdXLi4uTghPBrqW+moS8AlEbWt5/LB8MtA54V1GW+RJoF2tj/9tlvcBQHiL4VYZgfa0Pn5Ybr57PYBngP+i7kcFbuPNgTY4/jUvCfaY8LbCLfMkUD/HH7zG8vE/pb4s+JQ8CdTJ8QcbXxb8HPh+6qvLgCeB+jj+3r+xHD88/d6AJ8B/kve7A83Fk0AdHH/vfeA5wk1+oKw3B03BCJTN8fd2enNQCMeDFxhUomHeHCiX4++dAy+xMn5YHwCAPxO+8skIlMjxx77Jhof8X/aCIG8Cd1NfeSaMQDkcf+wu4dt+a217RaBXMQIdI5A/xx+7S9jwRru8JJgR6BmBfDn+2Nbxw24BACMwZATy4/hjO40fdg8AGIEhI5APxx/befywXwDACAwZgfQcf2yv8cP+AQAjMGQE0nH8sb3HD4cFAIzAkBGYn+OPHTR+ODwAYASGjMB8HH/s4PHDcQEAIzBkBKbn+GNHjR+ODwAYgSEjMB3HHzt6/DBOAMAIDBmB8Tn+2Cjjh/ECAEZgyAiMx/HHRhs/jBsAMAJDRuB4jj826vhh/ACAERgyAodz/LHRxw/TBACMwJAR2J/jj00yfpguAGAEhozA7hx/bLLxw7QBACMwZAS2c/yxSccP0wcAjMCQEdjM8ccmHz/MEwAwAkNG4GmOPzbL+GG+AIARGDICPccfm238MG8AwAgMGQHHv2rW8cP8AQAjMNRyBBx/bPbxQ5oAgBEYajECjj+WZPyQLgBgBIZaioDjjyUbP6QNABiBoRYi4PhjSccP6QMARmCo5gg4/ljy8UMeAQAjMFRjBBx/LIvxQz4BACMwVFMEHH8sm/FDXgEAIzBUQwQcfyyr8UN+AQAjMFRyBBx/LLvxQ54BACMwVGIEHH8sy/FDvgEAIzBUUgQcfyzb8UPeAQAjMFRCBBx/LOvxQ/4BACMwlHMEHH8s+/FDGQEAIzCUYwQcf6yI8UM5AQAjMJRTBBx/rJjxQ1kBACMwlEMEHH+sqPFDeQEAIzCUMgKOP1bc+KHMAIARGEoRAccfK3L8UG4AwAgMzRkBxx8rdvxQdgDACAzNEQHHHyt6/FB+AMAIDE0ZAccfK378UEcAwAgMTREBxx+rYvxQTwDACAyNGQHHH6tm/FBXAMAIDI0RAccfq2r8UF8AwAgMHRMBxx+rbvxQZwDACAwdEgHHH6ty/FBvAMAIDO0TAccfq3b8UHcAwAgM7RIBxx+revxQfwDACAxdFgHHH6t+/NBGAMAIDK2LgOOPNTF+aOt/ePc/9JXUF5KBLgIdx99rZvwAVy4uLlJfw9y+hRHonC9/dPxBU+OHNgMARkBPa2780M59AKu8T0BDTY4f2g0AGAEFzY4f2g4AGIHWNT1+MABgBFrV/PjBAHSMQFsc/5IB6BmBNjj+AQMQMwJ1c/wrDMDTjECdHP8aBmA9I1AXx7+BAdjMCNTB8V/CAFzOCJTN8W9hALYzAmVy/DswALsxAmVx/DsyALszAmVw/HswAPsxAnlz/HsyAPszAnly/AcwAIcxAnlx/AcyAIczAnlw/EcwAMcxAmk5/iMZgOMZgTQc/wgMwDiMwLwc/0gMwHiMwDwc/4gMwLiMwLQc/8gMwPiMwDQc/wQMwDSMwLgc/0QMwHSMwDgc/4QMwLSMwHEc/8QMwPSMwGEc/wwMwDyMwH4c/0wMwHyMwG4c/4wMwLyMwOUc/8wMwPyMwHqOPwEDkMYD4Dz1RWTknPB3opkZgPm9CLwOnKS+kIycEP5OXkx9Ia0xAPNy/JsZgQQMwHwc/3ZGYGYGYB6Of3dGYEYGYHqOf39GYCYGYFqO/3BGYAYGYDqO/3hGYGIGYBqOfzxGYEIGYHyOf3xGYCIGYFyOfzpGYAIGYDyOf3pGYGQGYByOfz5GYEQG4HiOf35GYCQG4DiOPx0jMAIDcDjHn54ROJIBOIzjz4cROIIB2J/jz48ROJAB2I/jz5cROIAB2J3jz58R2JMB2I3jL4cR2IMB2M7xl8cI7MgAXM7xl8sI7MAAbOb4y2cEtjAA6zn+ehiBSxiApzn++hiBDQxAzPHXywisYQB6jr9+RmCFAQgcfzuMwIABcPwtMgJLrQfA8bfLCNB2ABy/mo9AqwFw/Oo0HYEWA+D4tarZCLQWAMcfu7v8R41GoKUhOP7YXeDVwc9fSX1BGegiAPCz1Bczh1ZOAI4/tjr+V/Ek0GnqJNBCABx/bHX8HSPQayYCtQfA8cc2jb9jBHpNRKDmADj+2Lbxd4xAr/oI1BoAxx/bdfwdI9CrOgI1BsDxx/Ydf8cI9KqNQG0BcPyxQ8ffMQK9KiNQUwAcf+zY8XeMQK+6CNQSAMcfG2v8HSPQqyoCNQTA8cfGHn/HCPSqiUDpAXD8sanG3zECvSoiUHIAHH9s6vF3jECv+AiUGgDHH5tr/B0j0Cs6AiUGwPHH5h5/xwj0io1AaQFw/LFU4+8YgV6RESgpAI4/lnr8HSPQKy4CpQTA8cdyGX/HCPSKikAJAXD8sdzG3zECvWIikHsAHH8s1/F3jECviAjkHADHH8t9/B0j0Ms+ArkGwPHHShl/xwj0so5AjgFw/LHSxt8xAr1sI5BbABx/rNTxd4xAL8sI5BQAxx8rffwdI9DLLgK5BMDxx2oZf8cI9LKKQA4BcPyx2sbfMQK9bCKQOgCOP1br+DtGoJdFBFIGwPHHah9/xwj0kkcgVQAcf6yV8XeMQC9pBFIEwPHHWht/xwj0kkVg7gA4/lir4+8YgV6SCMwZAMcfa338HSPQmz0CcwXA8cccf8wI9GaNwBwBcPwxx7+eEejNFoGpA+D4Y47/ckagN0sEpgyA4485/t0Ygd7kEZgqAI4/5vj3YwR6k0ZgigA4/pjjP4wR6E0WgbED4Phjjv84RqA3SQTGDIDjjzn+cRiB3ugRGCsAjj/m+MdlBHqjRmCMADj+mOOfhhHojRaBYwPg+GOOf1pGoDdKBI4JgOOPOf55GIHe0RE4NACOP+b452UEekdF4JAAOP6Y40/DCPQOjsC+AXD8MceflhHoHRSBfQLg+GOOPw9GoLd3BHYNgOOPOf68GIHeXhHYJQCOP+b482QEejtHYFsAHH/M8efNCPR2isCVi4uLTR/7HPA7HH/H8ZfjW8ArqS8iE+fAS8DP131wUwBOgXeXP8rxl8gI9B4DzwHvr35g3U2Aq8A9HH/H8ZfJmwO9Zwibvr76gXUB+CHwbOorzoTjL5sR6H0MeIOVm/SrAbgNvJz6SjPh+OtgBHrPA98Y/sLqfQDvAp9JfZUZcPz18T6B4CHwceAJxCeAOzh+cPy18iQQnALf6X7SnQBOgD8BN1JfXWKOv36eBOAR4RTwqDsB3MbxO/42eBKAa4QT///fBLiZ+ooSc/xtMQLwN9DfBPhv2v2+v+NvV8s3B86BjywI3/N3/GpRyyeBE+ArC+BLqa8kEccvaDsCX1wAn0h9FQk4fg21GoEbC9Y8Prhyjl/rtBiB6wvauv3v+HWZ1iJw2lIAHL920VIETqd4e/AcOX7to5kILICz1BcxMcevQ7QQgbPaA+D4dYzaI3C2IDw9sEaOX2OoOQIPF8AHqa9iAo5fY6o1AvcXwDupr2Jkjl9TqDECf7hycXFxAvwv4YUDS+f4NbWankD0VwvCs4LeTH0lI3D8mkMtJ4F3WN4HAPDL1FdzJMevOdUQgV9B/3oA14C/LH8sjeNXKqXeHDgHPsXyTkAIrxH2g9RXdQDHr5RKPQn8CLgP8cuCXyWcAkp5boDjVy5KOgk8Ibwg6EOIXxb8CeWcAhy/clLSSeA1Bg/+W31jkKvA78n7/QEcv3KV+0ngAfBZBg//X3024BPgBfJ9eLDjV85yPgk8Jmw7eu7PuqcDPyC8n/h56ite4fhVglwj8DXgvdVf3PR6AG8DX099xQOOXyXJLQLfA3667gOr9wGs+gbhNs0JaZwD3yTccSGV5kXgP0j7MPvvAf+06YPbAgDhLYXfYP4XDz0j3BR5a+bPK43p08A94GMzf97HhGP/Ty/7TbsEgOXF31v+YebwPuEOiw9n+nzSlK4Tvog+P9Pne0DYz3vbfuOurwn4IfAc8C+ERw1O5dHyczyH41c9zoAvE+4XmPI7bE8I9z98lh3GD7ufAIauAd8G/p7wuIGxLvw14LtMGxgptavAd4C/Y7zn3pwTHt77XfYMzCEB6JwS3mL4JvAFDruj8G3CMxF/tO+FS4W7BnyVsJ/nOWw/7xCe1fdjlo/t39cxAVj9w9wCPg/cIMThOv3zCs4IAz9bXuhvgV9Q9wuSSrt6BvgK8EXCfrrtDPfTbeg+8AfCa3gc/UXz/wDuRhuL94lb8QAAAABJRU5ErkJggg==) no-repeat left center' });
    iwCloseBtn.css({ 'background-size': '13px' });
    iwCloseBtn.children(':nth-child(1)').css({ 'display': 'none' });
    iwCloseBtn.mouseout(function () {
      $(this).css({ opacity: '0.5' });
    });
  }

  startWindow(marker) {
    marker.nguiMapComponent.openInfoWindow('iw', marker);
    var iwOuter = $('.gm-style-iw');
    var iwBackground = iwOuter.prev();
    iwBackground.css({ 'border': '1px solid #000' });
    iwBackground.css({ 'background-color': 'red' });
    iwBackground.children(':nth-child(3)').css({ 'z-index': '1' });
    iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
    iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
    iwOuter.children(':nth-child(1)').css({ 'box-shadow': 'rgba(0, 0, 0, 0.6) 0px 1px 6px' });
    iwOuter.children(':nth-child(1)').css({ 'background-color': 'white' });
    var iwCloseBtn = iwOuter.next();
    var altura = $('.iw-title').height();
    var iwDiv = $('.iw-title').next();
    iwDiv.css({ 'padding': '10px' });

    iwCloseBtn.css({
      opacity: '0.5',
      top: '38px',
      right: '57px'
    });
    iwOuter.next().next().css({ 'top': '15px', right: '44px' })
    iwCloseBtn.css({ 'background-color': 'red' });
    iwCloseBtn.css({ 'background': 'url(data:image/png;base64,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) no-repeat left center' });
    iwCloseBtn.css({ 'background-size': '13px' });
    iwCloseBtn.children(':nth-child(1)').css({ 'display': 'none' });
    iwCloseBtn.mouseout(function () {
      $(this).css({ opacity: '0.5' });
    });
  }

  getPosition(event: any) {
  }



  /**
   * ///////////////////////////////////////
   * Util
   */
  parseToLatLng(s1, s2){
    return new google.maps.LatLng(s1, s2);
  }
  
  isInsideRange(r:any){
    return r <= this.accuracyRange;
  }

  /**
   * This method updates the array 'path' with markers that satisfies the given accuracy.
   */
  rangedMarkers = [];
  updatePaths(){
    this.path = [];
    
    // 
    this.rangedMarkers = this.markers.filter(elem => {
      return elem.accuracy <= this.accuracyRange;
    });
    
    this.rangedMarkers.forEach(m =>{
      if(m.accuracy <= this.accuracyRange){
        this.path.push({ "lat": m.position[0], "lng": m.position[1]});
      }
    });

    this.getLastPostition();

    // console.log('-');
    // console.log('rangedMarkers: ' + JSON.stringify(this.rangedMarkers));
    // console.log('rangedMarkers: ' + JSON.stringify(this.path));
    // console.log('this.markers: ' + JSON.stringify(this.markers));
    // console.log('-');
  }
  
  /**
   * This method updates the array 'path' with markers that satisfies the given accuracy.
   */
  getLastPostition() {
    //console.log('getLastPostition');

    // let auxArray = this.markers.filter(elem => {
    //   return elem.accuracy <= this.accuracyRange;
    // });

    // console.log('Filtered markers: ' + JSON.stringify(auxArray)); 
    // if(auxArray.length>0){
    //   this.lastPosition = auxArray[auxArray.length - 1];
    //   this.center = this.lastPosition.latLng;

    // }else{
    //   this.lastPosition = null;
    // }
    if (this.rangedMarkers.length>0){
      this.lastPosition = this.rangedMarkers[this.rangedMarkers.length - 1];
      this.center = this.lastPosition.latLng;

    }else{
      this.lastPosition = null;
    }
    //console.log('lastPosition: ' + JSON.stringify(this.lastPosition));
    //console.log('center: ' + JSON.stringify(this.center));
  }

  getPin(){
    let pin = null;
    let alertCode = this.packing.alertCode;

    switch (alertCode) {
      case 1:
        pin = { url: '../../../assets/images/pin_ausente.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 2:
        pin = { url: '../../../assets/images/pin_incorreto.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 3:
        pin = { url: '../../../assets/images/pin_bateria.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 4:
        pin = { url: '../../../assets/images/pin_atrasado.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      case 5:
        pin = { url: '../../../assets/images/pin_permanencia.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;

      default:
        pin = { url: '../../../assets/images/pin_normal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        break;
    }   
    return pin;
  }

  getPinWithAlert(i: number) {
    let pin = null;
    let alertCode = this.packing.alertCode;

    switch (alertCode){
      case 1:
        pin = { url: '../../../assets/images/pin_ausente.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_ausente_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_ausente_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case 2:
        pin = { url: '../../../assets/images/pin_incorreto.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_incorreto_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_incorreto_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case 3:
        pin = { url: '../../../assets/images/pin_bateria.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_bateria_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_bateria_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case 4:
        pin = { url: '../../../assets/images/pin_atrasado.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_atrasado_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_atrasado_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;

      case 5:
        pin = { url: '../../../assets/images/pin_permanencia.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_permanencia_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_permanencia_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;
      
      default:
        pin = { url: '../../../assets/images/pin_normal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        if (this.rangedMarkers.length > 1) {
          if (i == 0) pin = { url: '../../../assets/images/pin_normal_first.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
          if (i == (this.rangedMarkers.length - 1)) pin = { url: '../../../assets/images/pin_normal_final.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
        }
        break;
    }
    
    return pin;
  }

  getRadiusWithAlert(){
    let pin = "#027f01";
    let alertCode = this.packing.alertCode;

    switch (alertCode) {
      case 1:
        pin = "#ef5562";
        break;

      case 2:
        pin = "#f77737";
        break;

      case 3:
        pin = "#f8bd37";
        break;

      case 4:
        pin = "#4dc9ff";
        break;

      case 5:
        pin = "#4c7bff";
        break;
    }

    return pin;
  }
}

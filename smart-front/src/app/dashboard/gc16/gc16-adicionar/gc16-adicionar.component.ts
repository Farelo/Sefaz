import { Component, OnInit } from '@angular/core';
import { GC16 } from '../../../shared/models/gc16';

@Component({
  selector: 'app-gc16-adicionar',
  templateUrl: './gc16-adicionar.component.html',
  styleUrls: ['./gc16-adicionar.component.css']
})

export class Gc16AdicionarComponent implements OnInit {
  public gc16:  GC16;

  constructor() {
    this.gc16 = new GC16({factoryStock: {}, supplierStock: {}, transportationGoing: {}, transportantionBack: {}, secutiryFactor: {}, frequency: {}});
  }

  finish(){
    console.log(this.gc16);
  }

  onBlurMethod(){


    if(this.gc16.capacity && this.gc16.annualVolume && this.gc16.productiveDays){
      this.gc16.containerDays = Math.floor(((this.gc16.annualVolume/this.gc16.productiveDays)/this.gc16.capacity));
    }
    //setting Initializate
    if(this.gc16.factoryStock.days && this.gc16.supplierStock.days && this.gc16.transportationGoing.days && this.gc16.transportantionBack.days && this.gc16.frequency.days){
      this.gc16.frequency.QuantTotalDays = (this.gc16.factoryStock.days + this.gc16.supplierStock.days + this.gc16.transportationGoing.days + this.gc16.transportantionBack.days) + (2 * this.gc16.frequency.days);
      if(this.gc16.containerDays && this.gc16.frequency.QuantTotalDays && this.gc16.secutiryFactor.percentage){
        //secutiryFactor
        this.gc16.secutiryFactor.QuantTotalBuilt = Math.floor(((((1 + this.gc16.secutiryFactor.percentage)/100)*this.gc16.containerDays)*this.gc16.frequency.QuantTotalDays));
        this.gc16.secutiryFactor.QuantContainer = Math.floor(((this.gc16.secutiryFactor.percentage*this.gc16.secutiryFactor.QuantTotalBuilt)/100));
        //Frequencia
        this.gc16.frequency.fr = Math.floor(((this.gc16.frequency.days/this.gc16.frequency.QuantTotalDays)*100));
        this.gc16.frequency.QuantContainer = Math.floor(((this.gc16.frequency.fr/100)*this.gc16.secutiryFactor.QuantTotalBuilt));
        //Estoque da Fábrica
        this.gc16.factoryStock.fs = Math.floor(((this.gc16.factoryStock.days/this.gc16.frequency.QuantTotalDays)*100));
        this.gc16.factoryStock.QuantContainerfs = Math.floor(((this.gc16.factoryStock.fs/100)*this.gc16.secutiryFactor.QuantTotalBuilt));
        this.gc16.factoryStock.QuantContainerfsMax = (this.gc16.factoryStock.QuantContainerfs + this.gc16.frequency.QuantContainer);
        this.gc16.factoryStock.fsMax = (this.gc16.factoryStock.fs + this.gc16.frequency.fr);
        //Estoque do Fornecedor
        this.gc16.supplierStock.ss = Math.floor(((this.gc16.supplierStock.days/this.gc16.frequency.QuantTotalDays)*100));
        this.gc16.supplierStock.QuantContainerSs = Math.floor(((this.gc16.supplierStock.ss/100)*this.gc16.secutiryFactor.QuantTotalBuilt));
        this.gc16.supplierStock.QuantContainerSsMax = (this.gc16.supplierStock.QuantContainerSs + this.gc16.frequency.QuantContainer);
        this.gc16.supplierStock.ssMax = (this.gc16.supplierStock.ss + this.gc16.frequency.fr);
        //Transport Ida
        this.gc16.transportationGoing.tg = Math.floor(((this.gc16.transportationGoing.days/this.gc16.frequency.QuantTotalDays)*100));
        this.gc16.transportationGoing.QuantContainerTg = Math.floor(((this.gc16.transportationGoing.tg/100)*this.gc16.secutiryFactor.QuantTotalBuilt));
        //Transport Volta
        this.gc16.transportantionBack.tb = Math.floor(((this.gc16.transportantionBack.days/this.gc16.frequency.QuantTotalDays)*100));
        this.gc16.transportantionBack.QuantContainerTb = Math.floor(((this.gc16.transportantionBack.tb/100)*this.gc16.secutiryFactor.QuantTotalBuilt));

      }
    }

  }

  ngOnInit() {

  }

}

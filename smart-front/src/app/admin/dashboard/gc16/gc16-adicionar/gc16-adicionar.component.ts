import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { GC16 } from '../../../../shared/models/gc16';
import { Project } from '../../../../shared/models/project';
import { SuppliersService } from '../../../../servicos/suppliers.service';
import { Supplier } from '../../../../shared/models/supplier';
import { PackingService } from '../../../../servicos/packings.service';
import { ProjectService } from '../../../../servicos/projects.service';
import { GC16Service } from '../../../../servicos/gc16.service';
import { ToastService } from '../../../../servicos/toast.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as $ from 'jquery'


@Component({
  selector: 'app-gc16-adicionar',
  templateUrl: './gc16-adicionar.component.html',
  styleUrls: ['./gc16-adicionar.component.css'],
})

export class Gc16AdicionarComponent implements OnInit {
  @ViewChild('drawer') drawer: ElementRef;
  public gc16 : FormGroup;
  public suppliers = [];
  public packings : any [];
  public project : Project;
  public selectedPacking = "";

  constructor(
    private suppliersService: SuppliersService,
    private packingService: PackingService,
    private projectService: ProjectService,
    private GC16Service: GC16Service,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}


  onSubmit({ value, valid }: { value: GC16, valid: boolean }): void {
    if(valid){
      value.packing = this.gc16['controls'].packing.value.packing;
      value.project = this.gc16['controls'].project.value._id;

      this.GC16Service.createGC16(value)
                      .subscribe(result => this.packingService.updatePackingByGC16(value.packing,value.supplier._id,value.project,{gc16: result.data._id})
                      .subscribe(result => {
                        this.toastService.success('/rc/gc16', 'GC16');
                      }, err => this.toastService.error(err)));
    }


  }

  onBlurMethod(){
    let capacity = this.gc16.controls.capacity.value
    let annualVolume = this.gc16.controls.annualVolume.value
    let productiveDays = this.gc16.controls.productiveDays.value
    let fsDays = this.gc16.controls.factoryStock['controls'].fsDays.value
    let ssDays = this.gc16.controls.supplierStock['controls'].ssDays.value
    let fDays = this.gc16.controls.frequency['controls'].fDays.value
    let tgDays = this.gc16.controls.transportationGoing['controls'].tgDays.value
    let tbDays = this.gc16.controls.transportantionBack['controls'].tbDays.value
    let containerDays = this.gc16['controls'].containerDays.value
    let percentage = this.gc16['controls'].secutiryFactor['controls'].percentage.value

    if ((capacity || capacity == 0) && (annualVolume || annualVolume == 0) && (productiveDays || productiveDays == 0)){
      this.gc16.controls.containerDays.setValue(Math.floor(((annualVolume / productiveDays) / capacity)));
      containerDays = this.gc16['controls'].containerDays.value
      
    }
    //setting Initializate
    if ((fsDays || fsDays == 0) && (ssDays || ssDays == 0) && (tgDays || tgDays == 0) && (tbDays || tbDays == 0) && (fDays || fDays == 0)){
      this.gc16.controls.frequency['controls'].QuantTotalDays.setValue((fsDays+ ssDays + tgDays + tbDays) + (2 * fDays));
      let QuantTotalDays = this.gc16['controls'].frequency['controls'].QuantTotalDays.value
  
      if ((containerDays || containerDays == 0) && (QuantTotalDays || QuantTotalDays == 0) && (percentage || percentage == 0)){
        //secutiryFactor
        console.log(containerDays)
        this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.setValue(Math.ceil(((((1 + (percentage / 100)) * containerDays)*QuantTotalDays))));
        
        this.gc16['controls'].secutiryFactor['controls'].QuantContainer.setValue(Math.ceil(((percentage*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)/100)));
        // //Frequencia
        this.gc16['controls'].frequency['controls'].fr.setValue(Math.floor(((this.gc16['controls'].frequency['controls'].fDays.value/QuantTotalDays)*100)));
        this.gc16['controls'].frequency['controls'].QuantContainer.setValue(Math.floor(((this.gc16['controls'].frequency['controls'].fr.value/100)*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        // //Estoque da Fábrica
        this.gc16['controls'].factoryStock['controls'].fs.setValue(Math.floor(((this.gc16['controls'].factoryStock['controls'].fsDays.value/QuantTotalDays)*100)));
        this.gc16['controls'].factoryStock['controls'].QuantContainerfs.setValue(Math.floor(((this.gc16['controls'].factoryStock['controls'].fs.value/100)*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        this.gc16['controls'].factoryStock['controls'].QuantContainerfsMax.setValue((this.gc16['controls'].factoryStock['controls'].QuantContainerfs.value + this.gc16['controls'].frequency['controls'].QuantContainer.value));
        this.gc16['controls'].factoryStock['controls'].fsMax.setValue((this.gc16['controls'].factoryStock['controls'].fs.value + this.gc16['controls'].frequency['controls'].fr.value));
        // //Estoque do Fornecedor
        this.gc16['controls'].supplierStock['controls'].ss.setValue(Math.floor(((this.gc16['controls'].supplierStock['controls'].ssDays.value/QuantTotalDays)*100)));
        this.gc16['controls'].supplierStock['controls'].QuantContainerSs.setValue(Math.floor(((this.gc16['controls'].supplierStock['controls'].ss.value/100)*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        this.gc16['controls'].supplierStock['controls'].QuantContainerSsMax.setValue((this.gc16['controls'].supplierStock['controls'].QuantContainerSs.value + this.gc16['controls'].frequency['controls'].QuantContainer.value));
        this.gc16['controls'].supplierStock['controls'].ssMax.setValue((this.gc16['controls'].supplierStock['controls'].ss.value + this.gc16['controls'].frequency['controls'].fr.value));
        // //Transport Ida
        this.gc16['controls'].transportationGoing['controls'].tg.setValue(Math.floor(((this.gc16['controls'].transportationGoing['controls'].tgDays.value/QuantTotalDays)*100)));
        this.gc16['controls'].transportationGoing['controls'].QuantContainerTg.setValue(Math.floor(((this.gc16['controls'].transportationGoing['controls'].tg.value/100)*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        // //Transport Volta
        this.gc16['controls'].transportantionBack['controls'].tb.setValue(Math.floor(((this.gc16['controls'].transportantionBack['controls'].tbDays.value/QuantTotalDays)*100)));
        this.gc16['controls'].transportantionBack['controls'].QuantContainerTb.setValue(Math.floor(((this.gc16['controls'].transportantionBack['controls'].tb.value/100)*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        //

        console.log(this.gc16)
      }
    }

  }

  loadPackings(event: any):void{
    
    this.gc16['controls'].packing.setValue(undefined)
    if(event){
      this.packingService.getBySupplier(event._id).subscribe( result => {
          this.packings = result.data;

          if (this.packings.length == 0){
            this.gc16.controls.packing.disable()
          }else{
            this.gc16.controls.packing.enable()
          }
      }, err => {console.log(err)});
    }
  }

  loadProject(event: any):void{
    if(typeof event != 'string'){
      this.gc16['controls'].project.setValue(event.project)
    }else{
      this.gc16['controls'].project.setValue('');
    }
  }

  loadSuppliers():void{
    this.suppliersService.retrieveAll().subscribe(result => {this.suppliers = result.data}, err => {console.log(err)});
  }


  ngOnInit() {

      this.loadSuppliers();
      this.gc16 = this.fb.group({
        annualVolume: ['0', [Validators.required]],
        capacity: ['0', [Validators.required]],
        productiveDays: ['0', [Validators.required]],
        containerDays: ['0', [Validators.required]],
        project: ['0', [Validators.required]],
        packing: ['0', [Validators.required]],
        supplier: ['0', [Validators.required]],
        factoryStock:  this.fb.group({
         fsDays:  ['0', [Validators.required]],
         fs:  ['0', [Validators.required]],
         fsMax:  ['0', [Validators.required]],
         QuantContainerfs:  ['0', [Validators.required]],
         QuantContainerfsMax:  ['0', [Validators.required]]
       }),
        supplierStock: this.fb.group({
         ssDays:  ['0', [Validators.required]],
         ss:  ['0', [Validators.required]],
         ssMax:  ['0', [Validators.required]],
         QuantContainerSs:  ['0', [Validators.required]],
         QuantContainerSsMax:  ['0', [Validators.required]]
       }),
        transportationGoing: this.fb.group({
         tgDays:  ['0', [Validators.required]],
         tg:  ['0', [Validators.required]],
         QuantContainerTg:  ['0', [Validators.required]]
       }),
        transportantionBack: this.fb.group({
         tbDays:  ['0', [Validators.required]],
         tb:  ['0', [Validators.required]],
         QuantContainerTb:  ['0', [Validators.required]]
       }),
        frequency: this.fb.group({
         fDays:  ['0', [Validators.required]],
         fr:  ['0', [Validators.required]],
         QuantTotalDays:  ['0', [Validators.required]],
         QuantContainer:  ['0', [Validators.required]]
       }),
        secutiryFactor: this.fb.group({
         percentage:  ['0', [Validators.required]],
         QuantTotalBuilt:  ['0', [Validators.required]],
         QuantContainer:  ['0', [Validators.required]]
       })
      });

  }

}

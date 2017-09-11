import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { GC16 } from '../../../shared/models/gc16';
import { Project } from '../../../shared/models/project';
import { SuppliersService } from '../../../servicos/suppliers.service';
import { Supplier } from '../../../shared/models/supplier';
import { PackingService } from '../../../servicos/packings.service';
import { ProjectService } from '../../../servicos/projects.service';
import { GC16Service } from '../../../servicos/gc16.service';
import { ToastService } from '../../../servicos/toast.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
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

  ngAfterViewInit() {
    console.log($('.chzn-select-template-example').animate({scrollLeft: 100}, 500));

  }

  onSubmit({ value, valid }: { value: GC16, valid: boolean }): void {
    if(valid){
      value.packing = this.gc16['controls'].packing.value.packing;
      value.project = this.gc16['controls'].project.value._id;

      this.GC16Service.createGC16(value)
                      .subscribe(result => this.packingService.updatePackingByCode(this.gc16.value.packing,{gc16: result.data._id})
                      .subscribe(result => this.toastService.success('/rc/gc16', 'GC16'), err => this.toastService.error(err)));
    }


  }

  onBlurMethod(){


    if(this.gc16.controls.capacity.value && this.gc16.controls.annualVolume.value && this.gc16.controls.productiveDays.value){
      this.gc16.controls.containerDays.setValue(Math.floor(((this.gc16.controls.annualVolume.value/this.gc16.controls.productiveDays.value)/this.gc16.controls.capacity.value)));
    }
    //setting Initializate
    if(this.gc16.controls.factoryStock['controls'].fsDays.value && this.gc16.controls.supplierStock['controls'].ssDays.value && this.gc16.controls.transportationGoing['controls'].tgDays.value && this.gc16.controls.transportantionBack['controls'].tbDays.value && this.gc16.controls.frequency['controls'].fDays.value){
      this.gc16.controls.frequency['controls'].QuantTotalDays.setValue((this.gc16['controls'].factoryStock['controls'].fsDays.value + this.gc16['controls'].supplierStock['controls'].ssDays.value + this.gc16['controls'].transportationGoing['controls'].tgDays.value + this.gc16['controls'].transportantionBack['controls'].tbDays.value) + (2 * this.gc16['controls'].frequency['controls'].fDays.value));
      if(this.gc16['controls'].containerDays.value && this.gc16['controls'].frequency['controls'].QuantTotalDays.value && this.gc16['controls'].secutiryFactor['controls'].percentage.value){
        //secutiryFactor
        this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.setValue(Math.ceil(((((1 + (this.gc16['controls'].secutiryFactor['controls'].percentage.value/100))*this.gc16['controls'].containerDays.value)*this.gc16['controls'].frequency['controls'].QuantTotalDays.value))));
        this.gc16['controls'].secutiryFactor['controls'].QuantContainer.setValue(Math.ceil(((this.gc16['controls'].secutiryFactor['controls'].percentage.value*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)/100)));
        // //Frequencia
        this.gc16['controls'].frequency['controls'].fr.setValue(Math.floor(((this.gc16['controls'].frequency['controls'].fDays.value/this.gc16['controls'].frequency['controls'].QuantTotalDays.value)*100)));
        this.gc16['controls'].frequency['controls'].QuantContainer.setValue(Math.floor(((this.gc16['controls'].frequency['controls'].fr.value/100)*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        // //Estoque da Fábrica
        this.gc16['controls'].factoryStock['controls'].fs.setValue(Math.floor(((this.gc16['controls'].factoryStock['controls'].fsDays.value/this.gc16['controls'].frequency['controls'].QuantTotalDays.value)*100)));
        this.gc16['controls'].factoryStock['controls'].QuantContainerfs.setValue(Math.floor(((this.gc16['controls'].factoryStock['controls'].fs.value/100)*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        this.gc16['controls'].factoryStock['controls'].QuantContainerfsMax.setValue((this.gc16['controls'].factoryStock['controls'].QuantContainerfs.value + this.gc16['controls'].frequency['controls'].QuantContainer.value));
        this.gc16['controls'].factoryStock['controls'].fsMax.setValue((this.gc16['controls'].factoryStock['controls'].fs.value + this.gc16['controls'].frequency['controls'].fr.value));
        // //Estoque do Fornecedor
        this.gc16['controls'].supplierStock['controls'].ss.setValue(Math.floor(((this.gc16['controls'].supplierStock['controls'].ssDays.value/this.gc16['controls'].frequency['controls'].QuantTotalDays.value)*100)));
        this.gc16['controls'].supplierStock['controls'].QuantContainerSs.setValue(Math.floor(((this.gc16['controls'].supplierStock['controls'].ss.value/100)*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        this.gc16['controls'].supplierStock['controls'].QuantContainerSsMax.setValue((this.gc16['controls'].supplierStock['controls'].QuantContainerSs.value + this.gc16['controls'].frequency['controls'].QuantContainer.value));
        this.gc16['controls'].supplierStock['controls'].ssMax.setValue((this.gc16['controls'].supplierStock['controls'].ss.value + this.gc16['controls'].frequency['controls'].fr.value));
        // //Transport Ida
        this.gc16['controls'].transportationGoing['controls'].tg.setValue(Math.floor(((this.gc16['controls'].transportationGoing['controls'].tgDays.value/this.gc16['controls'].frequency['controls'].QuantTotalDays.value)*100)));
        this.gc16['controls'].transportationGoing['controls'].QuantContainerTg.setValue(Math.floor(((this.gc16['controls'].transportationGoing['controls'].tg.value/100)*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        // //Transport Volta
        this.gc16['controls'].transportantionBack['controls'].tb.setValue(Math.floor(((this.gc16['controls'].transportantionBack['controls'].tbDays.value/this.gc16['controls'].frequency['controls'].QuantTotalDays.value)*100)));
        this.gc16['controls'].transportantionBack['controls'].QuantContainerTb.setValue(Math.floor(((this.gc16['controls'].transportantionBack['controls'].tb.value/100)*this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        //
      }
    }

  }

  loadPackings(event: any):void{
    this.gc16['controls'].packing.setValue('');
    this.gc16['controls'].project.setValue('');
    if(event){
      this.gc16.controls.supplier.setValue(event.value);
      this.packingService.getBySupplier(event.value).subscribe(result => this.packings = result.data, err => {console.log(err)});
    }
  }

  loadProject(event: any):void{
    if(typeof event != 'string'){
      this.projectService.retrieveProject(event.project).subscribe(result => this.gc16['controls'].project.setValue(result.data), err => {console.log(err)});
    }else{
      this.gc16['controls'].project.setValue('');
    }
  }

  loadSuppliers():void{
    this.suppliersService.retrieveAll().subscribe(result => {this.suppliers = result}, err => {console.log(err)});
  }


  ngOnInit() {

      this.loadSuppliers();
      this.gc16 = this.fb.group({
        annualVolume: ['', [Validators.required]],
        capacity: ['', [Validators.required]],
        productiveDays: ['', [Validators.required]],
        containerDays: ['', [Validators.required]],
        project: ['', [Validators.required]],
        packing: ['', [Validators.required]],
        supplier: ['', [Validators.required]],
        factoryStock:  this.fb.group({
         fsDays:  ['', [Validators.required]],
         fs:  ['', [Validators.required]],
         fsMax:  ['', [Validators.required]],
         QuantContainerfs:  ['', [Validators.required]],
         QuantContainerfsMax:  ['', [Validators.required]]
       }),
        supplierStock: this.fb.group({
         ssDays:  ['', [Validators.required]],
         ss:  ['', [Validators.required]],
         ssMax:  ['', [Validators.required]],
         QuantContainerSs:  ['', [Validators.required]],
         QuantContainerSsMax:  ['', [Validators.required]]
       }),
        transportationGoing: this.fb.group({
         tgDays:  ['', [Validators.required]],
         tg:  ['', [Validators.required]],
         QuantContainerTg:  ['', [Validators.required]]
       }),
        transportantionBack: this.fb.group({
         tbDays:  ['', [Validators.required]],
         tb:  ['', [Validators.required]],
         QuantContainerTb:  ['', [Validators.required]]
       }),
        frequency: this.fb.group({
         fDays:  ['', [Validators.required]],
         fr:  ['', [Validators.required]],
         QuantTotalDays:  ['', [Validators.required]],
         QuantContainer:  ['', [Validators.required]]
       }),
        secutiryFactor: this.fb.group({
         percentage:  ['', [Validators.required]],
         QuantTotalBuilt:  ['', [Validators.required]],
         QuantContainer:  ['', [Validators.required]]
       })
      });

  }

}

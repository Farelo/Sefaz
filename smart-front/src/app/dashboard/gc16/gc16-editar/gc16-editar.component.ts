import { Component, OnInit } from '@angular/core';
import { GC16 } from '../../../shared/models/gc16'
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastService, GC16Service } from '../../../servicos/index.service';

@Component({
  selector: 'app-gc16-editar',
  templateUrl: './gc16-editar.component.html',
  styleUrls: ['./gc16-editar.component.css']
})

export class Gc16EditarComponent implements OnInit {

  public gc16:  FormGroup;
  public mActualGC16: any;
  public inscricao: Subscription;

  constructor(
    private GC16Service: GC16Service,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: ToastService) {

  }

  ngOnInit() {
    
    this.configureFormGroup();
    this.retrieveGC16();
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  configureFormGroup(){
    
    this.gc16 = this.fb.group({ 
      annual_volume: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
      productive_days: ['', [Validators.required]],
      container_days: ['', [Validators.required]],
      family: ['', [Validators.required]],
      security_factor: this.fb.group({
        percentage: ['', [Validators.required]],
        qty_total_build: ['', [Validators.required]],
        qty_container: ['', [Validators.required]]
      }),
      owner_stock: this.fb.group({
        days: ['', [Validators.required]],
        value: ['', [Validators.required]],
        max: ['', [Validators.required]],
        qty_container: ['', [Validators.required]],
        qty_container_max: ['', [Validators.required]]
      }),
      client_stock: this.fb.group({
        days: ['', [Validators.required]],
        value: ['', [Validators.required]],
        max: ['', [Validators.required]],
        qty_container: ['', [Validators.required]],
        qty_container_max: ['', [Validators.required]]
      }),
      transportation_going: this.fb.group({
        days: ['', [Validators.required]],
        value: ['', [Validators.required]],
        qty_container: ['', [Validators.required]]
      }),
      transportation_back: this.fb.group({
        days: ['', [Validators.required]],
        value: ['', [Validators.required]],
        qty_container: ['', [Validators.required]]
      }),
      frequency: this.fb.group({
        days: ['', [Validators.required]],
        fr: ['', [Validators.required]],
        qty_total_days: ['', [Validators.required]],
        qty_container: ['', [Validators.required]]
      })
    });
  }

  retrieveGC16(){
    this.inscricao = this.route.params.subscribe(params => {
      let id = params['id'];
      this.GC16Service.getGC16(id).subscribe(result => {
        this.mActualGC16 = result;
        (<FormGroup>this.gc16).patchValue(result, { onlySelf: true });
      });
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    console.log(valid)

    if(valid){

      value.family = this.mActualGC16.family._id;

      this.GC16Service.editGC16(this.mActualGC16._id, value).subscribe(result => {
        this.toastService.edit('/rc/bpline', 'BPline');
      }, err => this.toastService.error(err));
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

    if ((capacity || capacity == 0) && (annualVolume || annualVolume == 0) && (productiveDays || productiveDays == 0)) {
      this.gc16.controls.containerDays.setValue(Math.floor(((annualVolume / productiveDays) / capacity)));
      containerDays = this.gc16['controls'].containerDays.value

    }
    //setting Initializate
    if ((fsDays || fsDays == 0) && (ssDays || ssDays == 0) && (tgDays || tgDays == 0) && (tbDays || tbDays == 0) && (fDays || fDays == 0)) {
      this.gc16.controls.frequency['controls'].QuantTotalDays.setValue((fsDays + ssDays + tgDays + tbDays) + (2 * fDays));
      let QuantTotalDays = this.gc16['controls'].frequency['controls'].QuantTotalDays.value

      if ((containerDays || containerDays == 0) && (QuantTotalDays || QuantTotalDays == 0) && (percentage || percentage == 0)) {
        //secutiryFactor
        this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.setValue(Math.ceil(((((1 + (percentage / 100)) * containerDays) * QuantTotalDays))));

        this.gc16['controls'].secutiryFactor['controls'].QuantContainer.setValue(Math.ceil(((percentage * this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value) / 100)));
        // //Frequencia
        this.gc16['controls'].frequency['controls'].fr.setValue(Math.floor(((this.gc16['controls'].frequency['controls'].fDays.value / QuantTotalDays) * 100)));
        this.gc16['controls'].frequency['controls'].QuantContainer.setValue(Math.floor(((this.gc16['controls'].frequency['controls'].fr.value / 100) * this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        // //Estoque da Fábrica
        this.gc16['controls'].factoryStock['controls'].fs.setValue(Math.floor(((this.gc16['controls'].factoryStock['controls'].fsDays.value / QuantTotalDays) * 100)));
        this.gc16['controls'].factoryStock['controls'].QuantContainerfs.setValue(Math.floor(((this.gc16['controls'].factoryStock['controls'].fs.value / 100) * this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        this.gc16['controls'].factoryStock['controls'].QuantContainerfsMax.setValue((this.gc16['controls'].factoryStock['controls'].QuantContainerfs.value + this.gc16['controls'].frequency['controls'].QuantContainer.value));
        this.gc16['controls'].factoryStock['controls'].fsMax.setValue((this.gc16['controls'].factoryStock['controls'].fs.value + this.gc16['controls'].frequency['controls'].fr.value));
        // //Estoque do Fornecedor
        this.gc16['controls'].supplierStock['controls'].ss.setValue(Math.floor(((this.gc16['controls'].supplierStock['controls'].ssDays.value / QuantTotalDays) * 100)));
        this.gc16['controls'].supplierStock['controls'].QuantContainerSs.setValue(Math.floor(((this.gc16['controls'].supplierStock['controls'].ss.value / 100) * this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        this.gc16['controls'].supplierStock['controls'].QuantContainerSsMax.setValue((this.gc16['controls'].supplierStock['controls'].QuantContainerSs.value + this.gc16['controls'].frequency['controls'].QuantContainer.value));
        this.gc16['controls'].supplierStock['controls'].ssMax.setValue((this.gc16['controls'].supplierStock['controls'].ss.value + this.gc16['controls'].frequency['controls'].fr.value));
        // //Transport Ida
        this.gc16['controls'].transportationGoing['controls'].tg.setValue(Math.floor(((this.gc16['controls'].transportationGoing['controls'].tgDays.value / QuantTotalDays) * 100)));
        this.gc16['controls'].transportationGoing['controls'].QuantContainerTg.setValue(Math.floor(((this.gc16['controls'].transportationGoing['controls'].tg.value / 100) * this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        // //Transport Volta
        this.gc16['controls'].transportantionBack['controls'].tb.setValue(Math.floor(((this.gc16['controls'].transportantionBack['controls'].tbDays.value / QuantTotalDays) * 100)));
        this.gc16['controls'].transportantionBack['controls'].QuantContainerTb.setValue(Math.floor(((this.gc16['controls'].transportantionBack['controls'].tb.value / 100) * this.gc16['controls'].secutiryFactor['controls'].QuantTotalBuilt.value)));
        //

      }
    }

  }

  
}

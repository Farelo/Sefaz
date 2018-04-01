import { Component, OnInit } from '@angular/core';
import { GC16 } from '../../../shared/models/gc16'
import { GC16Service } from '../../../servicos/gc16.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastService } from '../../../servicos/toast.service';

@Component({
  selector: 'app-gc16-editar',
  templateUrl: './gc16-editar.component.html',
  styleUrls: ['./gc16-editar.component.css']
})

export class Gc16EditarComponent implements OnInit {
  public gc16:  FormGroup;
  public inscricao: Subscription;

  constructor(
    private GC16Service: GC16Service,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
  }


  onSubmit({ value, valid }: { value: GC16, valid: boolean }): void {

    if(valid){
      this.GC16Service.updateGC16(value._id,value)
                      .subscribe(result => {
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
        console.log(containerDays)
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

  ngOnInit() {
    this.gc16 = this.fb.group({
      annualVolume: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
      productiveDays: ['', [Validators.required]],
      containerDays: ['', [Validators.required]],
      project: ['', [Validators.required]],
      _id: ['', [Validators.required]],
      __v: [''],
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

    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params ['id'];
        this.GC16Service.retrieveGC16(id).subscribe(result => {
          (<FormGroup>this.gc16)
                  .setValue(result.data, { onlySelf: true });
        });
      }
    )
  }

  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }

}

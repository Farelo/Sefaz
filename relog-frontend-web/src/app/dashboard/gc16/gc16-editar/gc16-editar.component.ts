import { Component, OnInit } from '@angular/core';
import { GC16 } from '../../../shared/models/gc16'
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastService, GC16Service, CompaniesService, ControlPointsService } from '../../../servicos/index.service';

@Component({
  selector: 'app-gc16-editar',
  templateUrl: './gc16-editar.component.html',
  styleUrls: ['./gc16-editar.component.css']
})

export class Gc16EditarComponent implements OnInit {

  public listOfCompanies: any[] = [];
  public auxListOfCompanies: any[] = [];

  public selectedCompany: any = null;

  public listOfControlPoints: any[] = [];
  public auxListOfControlPoints: any[] = [];

  public gc16:  FormGroup;
  public mActualGC16: any;
  public inscricao: Subscription;

  constructor(
    private GC16Service: GC16Service,
    private companiesService: CompaniesService,
    private controlPointService: ControlPointsService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: ToastService) {

  }

  ngOnInit() {
    
    this.configureFormGroup();
    this.loadCompanies();
    this.loadControlPoints();
    this.retrieveGC16();
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  /**
 * Método para carregar a lista
 */
  loadCompanies() {
    this.companiesService.getAllCompanies().subscribe(result => {
      this.listOfCompanies = result;
    }, error => console.error(error));
  }

  loadControlPoints() {
    this.controlPointService.getAllControlPoint().subscribe(result => {
      this.listOfControlPoints = result;
      this.auxListOfControlPoints = result;
    }, error => console.error(error));
  }

  companySelected(event: any) {
    // console.log(event);
    
    this.gc16.patchValue({control_point: null});

    this.listOfControlPoints = this.auxListOfControlPoints.filter(elem => {
      return elem.company._id == event._id;
    });
  }

  configureFormGroup(){
    
    this.gc16 = this.fb.group({
      annual_volume: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
      productive_days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
      capacity: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
      container_days: ['', [Validators.required]],
      company: [undefined, [Validators.required]],
      control_point: [undefined, [Validators.required]],
      security_factor: this.fb.group({
        percentage: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
        qty_total_build: ['', [Validators.required]],
        qty_container: ['', [Validators.required]]
      }),
      owner_stock: this.fb.group({
        days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
        value: ['', [Validators.required]],
        max: ['', [Validators.required]],
        qty_container: ['', [Validators.required]],
        qty_container_max: ['', [Validators.required]]
      }),
      client_stock: this.fb.group({
        days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
        value: ['', [Validators.required]],
        max: ['', [Validators.required]],
        qty_container: ['', [Validators.required]],
        qty_container_max: ['', [Validators.required]]
      }),
      transportation_going: this.fb.group({
        days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
        value: ['', [Validators.required]],
        qty_container: ['', [Validators.required]]
      }),
      transportation_back: this.fb.group({
        days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
        value: ['', [Validators.required]],
        qty_container: ['', [Validators.required]]
      }),
      frequency: this.fb.group({
        days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
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
        this.resolveControlPoint(result.control_point);
        (<FormGroup>this.gc16).patchValue(result, { onlySelf: true });
      });
    });
  }

  resolveControlPoint(controlPoint: any){
    this.companiesService.getCompany(controlPoint.company).subscribe(result => {
      this.selectedCompany = result;
      (<FormGroup>this.gc16).patchValue({company: result});
    }, error => console.error(error));
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    // console.log(valid)

    if(valid){

      value.control_point = this.gc16['controls'].control_point.value._id;
      delete value.company;

      this.GC16Service.editGC16(this.mActualGC16._id, value).subscribe(result => {
        this.toastService.edit('/rc/bpline', 'BPline');
      }, err => this.toastService.error(err));
    }
  }

  onBlurMethod() {

    //console.log(this.gc16);

    //general
    let annual_volume = this.gc16.controls.annual_volume.value
    let capacity = this.gc16.controls.capacity.value
    let productive_days = this.gc16.controls.productive_days.value
    let container_days = this.gc16.controls.container_days.value

    //security_factor
    let percentage = this.gc16['controls'].security_factor['controls'].percentage.value

    //frequency
    let f_days = this.gc16.controls.frequency['controls'].days.value

    //transportation_going
    let tg_days = this.gc16.controls.transportation_going['controls'].days.value

    //transportation_back
    let tb_days = this.gc16.controls.transportation_back['controls'].days.value

    //owner_stock
    let os_days = this.gc16.controls.owner_stock['controls'].days.value

    //client_stock
    let cs_days = this.gc16.controls.client_stock['controls'].days.value

    if ((capacity || capacity == 0) && (annual_volume || annual_volume == 0) && (productive_days || productive_days == 0)) {

      this.gc16
        .controls.container_days
        .setValue(Math.floor(((annual_volume / productive_days) / capacity)));

      container_days = this.gc16['controls'].container_days.value
    }

    //setting Initializate
    if ((os_days || os_days == 0) && (cs_days || cs_days == 0) && (tg_days || tg_days == 0) && (tb_days || tb_days == 0) && (f_days || f_days == 0)) {

      this.gc16
        .controls
        .frequency['controls']
        .qty_total_days
        .setValue((os_days + cs_days + tg_days + tb_days) + (2 * f_days));

      let quantTotalDays = this.gc16['controls'].frequency['controls'].qty_total_days.value

      if ((container_days || container_days == 0) && (quantTotalDays || quantTotalDays == 0) && (percentage || percentage == 0)) {

        //security_factor
        this.gc16['controls']
          .security_factor['controls']
          .qty_total_build
          .setValue(Math.ceil(((((1 + (percentage / 100)) * container_days) * quantTotalDays))));

        this.gc16['controls']
          .security_factor['controls']
          .qty_container
          .setValue(Math.ceil(((percentage * this.gc16['controls'].security_factor['controls'].qty_total_build.value) / 100)));

        //frequency
        this.gc16['controls']
          .frequency['controls']
          .fr
          .setValue(Math.floor(((this.gc16['controls'].frequency['controls'].days.value / quantTotalDays) * 100)));

        this.gc16['controls']
          .frequency['controls']
          .qty_container
          .setValue(Math.floor(((this.gc16['controls'].frequency['controls'].fr.value / 100) * this.gc16['controls'].security_factor['controls'].qty_total_build.value)));

        //owner_stock
        this.gc16['controls']
          .owner_stock['controls']
          .value
          .setValue(Math.floor(((this.gc16['controls'].owner_stock['controls'].days.value / quantTotalDays) * 100)));

        this.gc16['controls']
          .owner_stock['controls']
          .qty_container
          .setValue(Math.floor(((this.gc16['controls'].owner_stock['controls'].value.value / 100) * this.gc16['controls'].security_factor['controls'].qty_total_build.value)));

        this.gc16['controls']
          .owner_stock['controls']
          .qty_container_max
          .setValue((this.gc16['controls'].owner_stock['controls'].qty_container.value + this.gc16['controls'].frequency['controls'].qty_container.value));

        this.gc16['controls']
          .owner_stock['controls']
          .max
          .setValue((this.gc16['controls'].owner_stock['controls'].value.value + this.gc16['controls'].frequency['controls'].fr.value));

        //client_stock
        this.gc16['controls']
          .client_stock['controls']
          .value
          .setValue(Math.floor(((this.gc16['controls'].client_stock['controls'].days.value / quantTotalDays) * 100)));

        this.gc16['controls']
          .client_stock['controls']
          .qty_container
          .setValue(Math.floor(((this.gc16['controls'].client_stock['controls'].value.value / 100) * this.gc16['controls'].security_factor['controls'].qty_total_build.value)));

        this.gc16['controls']
          .client_stock['controls']
          .qty_container_max
          .setValue((this.gc16['controls'].client_stock['controls'].qty_container.value + this.gc16['controls'].frequency['controls'].qty_container.value));

        this.gc16['controls']
          .client_stock['controls']
          .max
          .setValue((this.gc16['controls'].client_stock['controls'].value.value + this.gc16['controls'].frequency['controls'].fr.value));

        //transportation_going
        this.gc16['controls']
          .transportation_going['controls']
          .value
          .setValue(Math.floor(((this.gc16['controls'].transportation_going['controls'].days.value / quantTotalDays) * 100)));

        this.gc16['controls']
          .transportation_going['controls']
          .qty_container
          .setValue(Math.floor(((this.gc16['controls'].transportation_going['controls'].value.value / 100) * this.gc16['controls'].security_factor['controls'].qty_total_build.value)));

        //transportation_back
        this.gc16['controls']
          .transportation_back['controls']
          .value
          .setValue(Math.floor(((this.gc16['controls'].transportation_back['controls'].days.value / quantTotalDays) * 100)));

        this.gc16['controls']
          .transportation_back['controls']
          .qty_container
          .setValue(Math.floor(((this.gc16['controls'].transportation_back['controls'].value.value / 100) * this.gc16['controls'].security_factor['controls'].qty_total_build.value)));
      }
    }

  }

  
}

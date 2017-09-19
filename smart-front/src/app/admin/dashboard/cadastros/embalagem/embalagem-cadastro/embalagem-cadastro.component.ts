import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../../../../servicos/packings.service';;
import { Packing } from '../../../../../shared/models/packing';
import { TagsService } from '../../../../../servicos/tags.service';
import { SuppliersService } from '../../../../../servicos/suppliers.service';
import { ProjectService } from '../../../../../servicos/projects.service';;
import { Supplier } from '../../../../../shared/models/supplier';
import { Router } from '@angular/router';
import { Select2Module } from 'ng2-select2';
import { ToastService } from '../../../../../servicos/toast.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-embalagem-cadastro',
  templateUrl: './embalagem-cadastro.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class EmbalagemCadastroComponent implements OnInit {
  public packing : FormGroup;
  public tags =  [];
  public projects = [];
  public suppliers = [];
  public exist = false;


  constructor(
    private TagsService: TagsService,
    private PackingService: PackingService,
    private router: Router,
    private SuppliersService: SuppliersService,
    private ProjectService: ProjectService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) { }


  onSubmit({ value, valid }: { value: Packing, valid: boolean }): void {


    this.packing.controls.hashPacking.setValue(this.packing.controls.supplier.value._id + this.packing.controls.code.value);
    this.packing.controls.code_tag.setValue(this.packing.controls.tag.value.code);

    if(this.packing.valid){

      this.PackingService.createPacking([this.packing.value]).subscribe( result => this.toastService.success('/rc/cadastros/embalagem', 'Embalagem'), err => this.toastService.error(err) );
    }

  }

  loadTags():void {
    this.TagsService.retrieveAllNoBinded().subscribe( result => {this.tags = result.data}, err => {console.log(err)});
  }


  loadSuppliers():void{
    this.SuppliersService.retrieveAll().subscribe(result => this.suppliers = result, err => {console.log(err)});
  }

  loadProject():void{
    this.ProjectService.retrieveAll().subscribe(result => this.projects = result.data, err => {console.log(err)});
  }

  changed(e: any): void {
    this.packing['controls'].supplier['controls']._id.setValue(e.value);
    this.changeCode();
  }

  changeCode(){
    this.PackingService.retrievePackingBySupplierAndCode(this.packing.controls.code.value,this.packing['controls'].supplier['controls']._id.value)
        .subscribe(result => {

          if(result.data){

            this.packing.controls.project.setValue(result.data.project);
            if(result.data.gc16){
              this.packing.controls.gc16.setValue(result.data.gc16);
            }
            if(result.data.routes){
              this.packing.controls.routes.setValue(result.data.routes);
            }
            this.exist = true;
          }else{
            this.packing.controls.project.setValue("");
            this.packing.controls.gc16.setValue(String);
            this.packing.controls.route.setValue(String);
            this.exist = false;
          }}, err => {console.log(err)});
  }

  ngOnInit() {
    this.packing = this.fb.group({
      code: ['', [Validators.required]],
      type: ['', [Validators.required]],
      weigth: [Number, [Validators.required]],
      width: [Number, [Validators.required]],
      heigth: [Number, [Validators.required]],
      length: [Number, [Validators.required]],
      capacity:[Number, [Validators.required]],
      battery: [Number],
      problem: [false, [Validators.required]],
      missing: [false, [Validators.required]],
      traveling: [false, [Validators.required]],
      lastCommunication: [Number],
      permanence: this.fb.group({
        time_exceeded: [Boolean],
        date: [Number],
        amount_days:[Number]
      }),
      trip: this.fb.group({
        time_exceeded: [Boolean],
        date: [Number],
        time_countdown: [Number],
      }),
      packing_missing: this.fb.group({
        last_time: [Number],
        time_countdown: [Number]
      }),
      position: this.fb.group({
        latitude: [Number],
        longitude: [Number],
        accuracy: [Number],
        date: [Number]
      }),
      temperature: [Number],
      serial: ['', [Validators.required]],
      correct_plant_factory: [String],
      gc16: [String],
      routes: [String],
      correct_plant_supplier:[String],
      actual_plant: [String],
      tag: ['', [Validators.required]],
      code_tag: [String, [Validators.required]],
      department: [String],
      supplier: this.fb.group({
        _id:['', [Validators.required]]
      }),
      project: ['', [Validators.required]],
      hashPacking: [String, [Validators.required]]
    });

    this.loadTags();
    this.loadSuppliers();
    this.loadProject();
  }

}

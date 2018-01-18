import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../../../../servicos/packings.service';;
import { Packing } from '../../../../../shared/models/packing';
import { TagsService } from '../../../../../servicos/tags.service';
import { SuppliersService } from '../../../../../servicos/suppliers.service';
import { ProjectService } from '../../../../../servicos/projects.service';;
import { Supplier } from '../../../../../shared/models/supplier';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastService } from '../../../../../servicos/toast.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-embalagem-editar',
  templateUrl: './embalagem-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class EmbalagemEditarComponent implements OnInit {
  public inscricao: Subscription;
  public tags =  [];
  public projects = [];
  public suppliers = [];
  public packing : FormGroup;


  constructor(
    private TagsService: TagsService,
    private PackingService: PackingService,
    private router: Router,
    private SuppliersService: SuppliersService,
    private ProjectService: ProjectService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private fb: FormBuilder

  ) { }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    value.hashPacking = this.packing.controls.supplier.value._id + this.packing.controls.code.value;
    value.code_tag = this.packing.controls.tag.value.code;

    if(this.packing.valid){

      this.PackingService.updatePacking(value._id,value).subscribe( result => {
        this.toastService.edit('/rc/cadastros/embalagem', 'Embalagem');
      }, err => this.toastService.error(err) );
    }

  }

  loadTags():void {
    this.TagsService.retrieveAllNoBinded().subscribe( result => {
      this.tags = result.data;
      this.tags.push(this.packing.controls.tag.value)
    }, err => {console.log(err)});
  }


  loadSuppliers():void{
    this.SuppliersService.retrieveAll().subscribe(result => {
      let supplier = result.data.filter( o => String(this.packing.controls.supplier.value._id) === String(o._id))[0];
      this.packing.controls.supplier.setValue(supplier);
      this.suppliers = result.data;
    }, err => {console.log(err)});
  }

  loadProject():void{
    this.ProjectService.retrieveAll().subscribe(result =>{
      let project = result.data.filter( o => String(this.packing.controls.project.value._id) === String(o._id))[0];
      this.packing.controls.project.setValue(project);
      this.projects = result.data;
      }, err => {console.log(err)});
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
        date: [Number],
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
      gc16: [String],
      routes: [String],
      actual_gc16: [String],
      last_plant:[String],
      actual_plant:[String],
      tag: ['', [Validators.required]],
      code_tag: [String, [Validators.required]],
      department: [String],
      supplier: ['', [Validators.required]],
      project: ['', [Validators.required]],
      hashPacking: [String, [Validators.required]],
      _id:['', [Validators.required]],
      __v:['']
    });

    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params['id'];
        this.PackingService.retrievePacking(id).subscribe(result => {

          (this.packing)
                  .patchValue(result.data);

          this.loadTags();
          this.loadSuppliers();
          this.loadProject();
        });
      }
    )
  }

  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }

}

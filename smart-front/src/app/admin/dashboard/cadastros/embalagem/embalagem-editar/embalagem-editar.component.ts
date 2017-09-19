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

  registerPacking():void {
    // this.packing.hashPacking = this.packing.supplier + this.packing.code;
    // this.PackingService.updatePacking(this.packing._id,this.packing).subscribe( result => this.toastService.edit('/rc/cadastros/embalagem', "Embalagem"), err =>  this.toastService.error(err) );
  }

  loadTags():void {
    this.TagsService.retrieveAllNoBinded().subscribe( result => this.tags = result.data, err => {console.log(err)});
  }

  loadSuppliers():void{
    this.SuppliersService.retrieveAll().subscribe(result => this.suppliers = result, err => {console.log(err)});
  }

  loadProject():void{
    this.ProjectService.retrieveAll().subscribe(result => this.projects = result.data, err => {console.log(err)});
  }

  changed(e: any): void {
  //  this.packing.supplier= e.value;
 }


  ngOnInit() {
    this.loadTags();
    this.loadSuppliers();
    this.loadProject();

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
      route: [String],
      correct_plant_supplier:[String],
      actual_plant: [String],
      tag: ['', [Validators.required]],
      code_tag: [String, [Validators.required]],
      department: [String],
      supplier: ["", [Validators.required]],
      project: ["", [Validators.required]],
      hashPacking: [String, [Validators.required]]
    });

    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params['id'];
        this.PackingService.retrievePacking(id).subscribe(result => {
          (<FormGroup>this.packing)
                  .setValue(result.data, { onlySelf: true });
        });
      }
    )
  }

  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }



}

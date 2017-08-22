import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../../../servicos/packings.service';;
import { Packing } from '../../../../shared/models/packing';
import { TagsService } from '../../../../servicos/tags.service';
import { SuppliersService } from '../../../../servicos/suppliers.service';
import { ProjectService } from '../../../../servicos/projects.service';;
import { Supplier } from '../../../../shared/models/supplier';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastService } from '../../../../servicos/toast.service';

@Component({
  selector: 'app-embalagem-editar',
  templateUrl: './embalagem-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class EmbalagemEditarComponent implements OnInit {
  public inscricao: Subscription;
  public tags =  [];
  public projects = [];
  public suppliers : Supplier [];
  public packing:  Packing = new Packing();

  constructor(
    private TagsService: TagsService,
    private PackingService: PackingService,
    private router: Router,
    private SuppliersService: SuppliersService,
    private ProjectService: ProjectService,
    private route: ActivatedRoute,
    private toastService: ToastService

  ) { }

  registerPacking():void {
    this.packing.hashPacking = this.packing.supplier + this.packing.code;
    this.PackingService.updatePacking(this.packing._id,this.packing).subscribe( result => this.toastService.edit('/rc/cadastros/embalagem', "Embalagem"), err =>  this.toastService.error(err) );
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
   this.packing.supplier= e.value;
 }


  ngOnInit() {
    this.loadTags();
    this.loadSuppliers();
    this.loadProject();
    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params['id'];
        this.PackingService.retrievePacking(id).subscribe(result => {
          this.packing = result.data;
          this.packing.project =  this.packing.project._id;
          this.packing.supplier =  this.packing.supplier._id;
          this.packing.tag =  this.packing.tag._id;
        });
      }
    )
  }

  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }



}

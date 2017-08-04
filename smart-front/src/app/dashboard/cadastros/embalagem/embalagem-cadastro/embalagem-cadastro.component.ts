import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../../../servicos/packings.service';;
import { Packing } from '../../../../shared/models/packing';
import { TagsService } from '../../../../servicos/tags.service';
import { SuppliersService } from '../../../../servicos/suppliers.service';
import { ProjectService } from '../../../../servicos/projects.service';;
import { Supplier } from '../../../../shared/models/supplier';
import { Router } from '@angular/router';

@Component({
  selector: 'app-embalagem-cadastro',
  templateUrl: './embalagem-cadastro.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class EmbalagemCadastroComponent implements OnInit {

  constructor(
    private TagsService: TagsService,
    private PackingService: PackingService,
    private router: Router,
    private SuppliersService: SuppliersService,
    private ProjectService: ProjectService
  ) { }

  tags =  [];
  projects = [];
  suppliers : Supplier [];
  packing:  Packing = new Packing({problem:false,missing:false,tag_mac:"",supplier:"",project:""});

  registerPacking():void {
    this.PackingService.createPacking([this.packing]).subscribe( result => this.router.navigate(['/rc/cadastros/embalagem']) );
  }

  loadTags():void {
    this.TagsService.retrieveAllNoBinded().subscribe( result => this.tags = result.data, err => {console.log(err)});
  }


  loadSuppliers():void{
    this.SuppliersService.retrieveAll().subscribe(result => this.suppliers = result.data, err => {console.log(err)});
  }

  loadProject():void{
    this.ProjectService.retrieveAll().subscribe(result => this.projects = result.data, err => {console.log(err)});
  }




  ngOnInit() {

    this.loadTags();
    this.loadSuppliers();
    this.loadProject();
  }

}

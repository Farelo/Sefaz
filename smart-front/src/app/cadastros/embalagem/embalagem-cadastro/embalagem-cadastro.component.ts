import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../../servicos/packings.service';;
import { Packing } from '../../../shared/models/packing';
import { TagsService } from '../../../servicos/tags.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-embalagem-cadastro',
  templateUrl: './embalagem-cadastro.component.html',
  styleUrls: ['./embalagem-cadastro.component.css']
})
export class EmbalagemCadastroComponent implements OnInit {

  constructor(
    private TagsService: TagsService,
    private PackingService: PackingService,
    private router: Router
  ) { }

  tags =  [];
  packing:  Packing = new Packing({problem:false,missing:false});

  registerPlant():void {

    this.PackingService.createPacking([this.packing]).subscribe( result => this.router.navigate(['/cadastros/embalagem']) );
  }

  loadTags():void {
    this.TagsService.retrieveAllNoBinded().subscribe( result => this.tags = result );
  }

  ngOnInit() {
    console.log(this.packing);
    this.loadTags();
  }

}

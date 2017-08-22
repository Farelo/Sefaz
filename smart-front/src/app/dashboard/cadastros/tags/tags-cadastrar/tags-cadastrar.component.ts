import { Component, OnInit } from '@angular/core';
import { TagsService } from '../../../../servicos/tags.service';;
import { Tag } from '../../../../shared/models/Tag';
import { Router } from '@angular/router';
import { ToastService } from '../../../../servicos/toast.service';

@Component({
  selector: 'app-tags-cadastrar',
  templateUrl: './tags-cadastrar.component.html',
    styleUrls: ['../../cadastros.component.css']
})
export class TagsCadastrarComponent implements OnInit {

  constructor(
    private TagsService: TagsService,
    private router: Router,
    private ToastService:ToastService,
  ) {}

  public tag = new Tag();

  registerTag():void {
    this.TagsService.createTag(this.tag).subscribe( result => {this.ToastService.success('/rc/cadastros/tags',"Tag")}, err => this.ToastService.error(err));
  }

  ngOnInit() {

  }

}

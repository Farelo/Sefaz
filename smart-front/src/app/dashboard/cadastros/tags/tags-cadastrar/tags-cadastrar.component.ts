import { Component, OnInit } from '@angular/core';
import { TagsService } from '../../../../servicos/tags.service';;
import { Tag } from '../../../../shared/models/Tag';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-tags-cadastrar',
  templateUrl: './tags-cadastrar.component.html',
    styleUrls: ['../../cadastros.component.css']
})
export class TagsCadastrarComponent implements OnInit {

  constructor(
    private TagsService: TagsService,
    private router: Router,
    private _service: NotificationsService
  ) { }

  public options = {
        position: ["top", "left"],
        timeOut: 0,
        lastOnBottom: true,
    };


  public tag = new Tag();

  registerTag():void {
    this.TagsService.createTag(this.tag).subscribe( result => this.router.navigate(['/rc/cadastros/tags']) );
  }

  create() {
      this._service.success(
          'Some Title',
          'Some Content',
          {
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 10
          }
      )
  }

  ngOnInit() {
    console.log(this.tag);
  }

}

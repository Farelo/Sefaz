import { Component, OnInit } from '@angular/core';
import { TagsService } from '../../../../servicos/tags.service';
import { ToastService } from '../../../../servicos/toast.service';
import { Tag } from '../../../../shared/models/Tag';
import { Router,ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-tags-cadastrar',
  templateUrl: './tags-editar.component.html',
    styleUrls: ['../../cadastros.component.css']
})
export class TagsEditarComponent implements OnInit {
  public inscricao: Subscription;
  public tag = new Tag();

  constructor(
    private tagsService: TagsService,
    private router: Router,
    private toastyService:ToastService,
    private route: ActivatedRoute
  ) {}


  registerTag():void {
    this.tagsService.updateTag(this.tag._id,this.tag).subscribe( result => { this.toastyService.edit('/rc/cadastros/tags',"Tag")}, err => this.toastyService.error(err));
  }


  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params['id'];
        this.tagsService.retrieveTag(id).subscribe(result => {
          this.tag = result.data;
        });
      }
    )
  }

}

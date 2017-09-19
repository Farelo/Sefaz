import { Component, OnInit } from '@angular/core';
import { TagsService } from '../../../../../servicos/tags.service';;
import { Tag } from '../../../../../shared/models/Tag';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../servicos/toast.service';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-tags-cadastrar',
  templateUrl: './tags-cadastrar.component.html',
    styleUrls: ['../../cadastros.component.css']
})
export class TagsCadastrarComponent implements OnInit {
  public tag: FormGroup;

  constructor(
    private TagsService: TagsService,
    private router: Router,
    private ToastService:ToastService,
    private fb: FormBuilder
  ) {}

  onSubmit({ value, valid }: { value: Tag, valid: boolean }):void {
    if(valid)this.TagsService.createTag(value)
                 .subscribe( result => {this.ToastService.success('/rc/cadastros/tags',"Tag")}, err => this.ToastService.error(err));
  }

  ngOnInit() {
    this.tag = this.fb.group({
      code: ['',[Validators.required, Validators.maxLength(7),Validators.minLength(7)]]
    });
  }

}

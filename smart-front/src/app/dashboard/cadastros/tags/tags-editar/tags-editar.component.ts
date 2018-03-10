import { Component, OnInit } from '@angular/core';
import { TagsService } from '../../../../servicos/tags.service';
import { ToastService } from '../../../../servicos/toast.service';
import { Tag } from '../../../../shared/models/tag';
import { Router,ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-tags-cadastrar',
  templateUrl: './tags-editar.component.html',
    styleUrls: ['../../cadastros.component.css']
})
export class TagsEditarComponent implements OnInit {
  public inscricao: Subscription;
  public tag: FormGroup;

  constructor(
    private tagsService: TagsService,
    private router: Router,
    private toastyService:ToastService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}


  onSubmit({ value, valid }: { value: Tag, valid: boolean }):void {
    if(valid){
      this.tagsService
          .updateTag(value._id,value)
          .subscribe( result => {
            this.toastyService.edit('/rc/cadastros/tags',"Tag");
          }, err => this.toastyService.error(err));
    }
  }

  ngOnInit() {
    this.tag = this.fb.group({
      code: ['',[Validators.required, Validators.maxLength(7),Validators.minLength(7)]],
      _id: [''],
      __v: ['']
    });

    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params['id'];
        this.tagsService.retrieveTag(id).subscribe(result => {
           (<FormGroup>this.tag)
                   .setValue(result.data, { onlySelf: true });
        });
      })
  }
}

import { Component, OnInit } from '@angular/core';
import { Tag } from '../../../../shared/models/tag';
import { Router } from '@angular/router';
import { ToastService, TagsService } from '../../../../servicos/index.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tags-cadastrar',
  templateUrl: './tags-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class TagsCadastrarComponent implements OnInit {
  public tag: FormGroup;

  constructor(public translate: TranslateService,
    private TagsService: TagsService,
    private router: Router,
    private ToastService: ToastService,
    private fb: FormBuilder) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

  onSubmit({ value, valid }: { value: Tag, valid: boolean }): void {
    if (valid) {

      this.TagsService
        .createTag(value)
        .subscribe(result => {
          this.ToastService.success('/rc/cadastros/tags', this.translate.instant('MISC.TOAST.TAG'));
        }, err => this.ToastService.error(err));
    }
  }

  ngOnInit() {
    this.tag = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]]
    });
  }

}

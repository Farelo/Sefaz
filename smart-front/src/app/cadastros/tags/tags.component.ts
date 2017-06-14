import { Component, OnInit } from '@angular/core';
import { TagsService } from '../../servicos/tags.service';;
import { Tag } from '../../shared/models/Tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
    styleUrls: ['../cadastros.component.css']
})
export class TagsComponent implements OnInit {

  constructor(private TagsService: TagsService) { }
  // Local properties
  tags: Tag[];
    vazio: boolean = false;


  loadTags() {
    // Get all comments
    this.TagsService.getTagsPagination(10, 1)
      .subscribe(
      tags => this.tags = tags,
      err => {
        // Log errors if any
        console.log(err);
      });
  }

  ngOnInit() {
    // Load comments
    this.loadTags()
  }

}

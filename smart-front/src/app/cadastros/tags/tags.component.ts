import { Component, OnInit } from '@angular/core';
import { TagsService } from '../../servicos/tags.service';;
import { Tag } from '../../shared/models/Tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  constructor(private TagsService: TagsService) { }
  // Local properties
  tags: Tag[];


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

  removeTags(id):void{
    this.TagsService.deleteTag(id).subscribe(result =>   this.loadTags(), err => {console.log(err)})
  }

  ngOnInit() {
    // Load comments
    this.loadTags()
  }

}

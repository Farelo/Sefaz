import { Component, OnInit } from '@angular/core';
import { CheckpointService } from '../../../servicos/checkpoints.service';;
import { Checkpoint } from '../../../shared/models/Checkpoint';
import { Pagination } from '../../../shared/models/pagination';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
    styleUrls: ['../cadastros.component.css']
})
export class ScannerComponent implements OnInit {
  public data: Pagination = new Pagination({meta: {page : 1}});
  public search : string;
  constructor(private CheckpointService : CheckpointService) { }

      searchEvent(): void{
        if(this.search != "" && this.search){
          // this.PackingService.getPackingsPaginationByAttr(10,this.data.meta.page,this.search)
          //   .subscribe(result => this.data = result, err => {console.log(err)});
        }else{
          this.loadCheckpoints();
        }
      }

    loadCheckpoints(){
      this.CheckpointService.getCheckpointsPagination(10,1)
        .subscribe(data => this.data = data,
         err => {console.log(err)});
    }

    pageChanged(page: any): void{
      this.data.meta.page = page;
      this.loadCheckpoints();
    }

    removeScanner(id):void{
      this.CheckpointService.deleteCheckpoint(id).subscribe(result =>   this.loadCheckpoints(), err => {console.log(err)})
    }

    ngOnInit() {
      this.loadCheckpoints();
    }

}

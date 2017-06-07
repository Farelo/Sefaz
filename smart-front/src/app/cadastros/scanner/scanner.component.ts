import { Component, OnInit } from '@angular/core';
import { CheckpointService } from '../../servicos/checkpoints.service';;
import { Checkpoint } from '../../shared/models/Checkpoint';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {

  constructor(private CheckpointService : CheckpointService) { }

    checkpoints: Checkpoint [];

    loadCheckpoints(){
      this.CheckpointService.getCheckpointsPagination(10,1)
        .subscribe(checkpoints => this.checkpoints = checkpoints,
         err => {console.log(err)});
    }

    ngOnInit() {
      this.loadCheckpoints();
    }

}

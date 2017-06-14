import { Component, OnInit } from '@angular/core';
import { CheckpointService } from '../../../servicos/checkpoints.service';;
import { Checkpoint } from '../../../shared/models/Checkpoint';
import { Router } from '@angular/router';
import { Department } from '../../../shared/models/department';
import { DepartmentService } from '../../../servicos/departments.service';;

@Component({
  selector: 'app-scanner-cadastrar',
  templateUrl: './scanner-cadastrar.component.html',
  styleUrls: ['./scanner-cadastrar.component.css']
})
export class ScannerCadastrarComponent implements OnInit {

  constructor(
    private CheckpointService: CheckpointService,
    private DepartmentService: DepartmentService,
    private router: Router
  ) { }

  checkpoint: Checkpoint = new Checkpoint({department: ""});
  departments = [] ;

  registerCheckpoint():void {
    this.checkpoint.code = "00"+this.checkpoint.code;

    this.CheckpointService.createCheckpoint([this.checkpoint]).subscribe( result => this.router.navigate(['/cadastros/scanner']) );
  }

  loadDepartments():void {
    this.DepartmentService.retrieveAll().subscribe(result =>  this.departments = result);
  }

  ngOnInit() {
    console.log(this.checkpoint);
    this.loadDepartments();
  }

}

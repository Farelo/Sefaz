  import { Component, OnInit } from '@angular/core';
  import { PackingService } from '../../servicos/index.service'; 
  import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

  @Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
  })
  export class HomeComponent implements OnInit {
    
    public localIncorretoCollapsed = false;
    public tempoDePermanenciaCollapsed = false;
    public semSinalCollapsed = false;

    constructor(private packingService: PackingService) {

    }

    ngOnInit() {
      
    }

  }

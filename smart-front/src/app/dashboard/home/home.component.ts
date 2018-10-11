  import { Component, OnInit } from '@angular/core';
  import { PackingService, HomeService } from '../../servicos/index.service';
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
    public atrasadaCollapsed = false;
    public ausenteCollapsed = false;
    public bateriaBaixaCollapsed = false;

    public resume: any = {
      quantityTotal: 0,
      quantityTraveling: 0,
      quantityIncorrectLocal: 0,
      quantityMissing: 0,
      quantityLate: 0,
      quantityTimeExceeded: 0,
      quantityInFactory: 0,
      quantityInSupplier: 0,
      quantityNoSignal: 0
    };

    constructor(private homeService: HomeService) { }

    ngOnInit() {
      this.getResume();
    }

    getResume() {
      this.homeService.getResumeHome().subscribe(result => {
        //console.log('result: ' + JSON.stringify(result));
        this.resume = result;

      }, err => { console.log(err) });
    }
  }

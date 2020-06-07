import { Component, OnInit } from '@angular/core';
import { PackingService, HomeService } from '../../servicos/index.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

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
    qtd_total: 0,
    qtd_in_cp: 0,
    qtd_in_traveling: 0,
    qtd_in_incorrect_cp: 0,
    qtd_permanence_time_exceeded: 0,
    qtd_traveling_late: 0,
    qtd_traveling_missing: 0,
    qtd_with_low_battery: 0
  };

  constructor(public translate: TranslateService, private homeService: HomeService) {
    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

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

import { Component, OnInit, Input } from '@angular/core';
import { HomeService } from '../../../servicos/home.service';
import { Pagination } from '../../../shared/models/pagination';
import { AuthenticationService } from 'app/servicos/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categoria-pontos-de-controle',
  templateUrl: './categoria-pontos-de-controle.component.html',
  styleUrls: ['./categoria-pontos-de-controle.component.css']
})
export class CategoriaPontosDeControleComponent implements OnInit {

  @Input() resume: any;

  public progressControle: number[] = [];

  public listIncorrectLocal: any[] = [];
  public listPermanenceTime: any[] = [];

  public tempoDePermanenciaCollapsed: boolean = false;
  public localIncorretoCollapsed: boolean = false;

  public listIncorrectActualPage: number = -1;
  public listPermanenceActualPage: number = 0;

  public settings: any = {};

  constructor(public translate: TranslateService,
    private homeService: HomeService,
    private authenticationService: AuthenticationService) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

  ngOnInit() {

    this.getSettings();
    this.getListIncorrectLocal();
    this.getListPermanenceTime();
    this.calculateProgress();
  }

  ngOnChanges() {

    // console.log('[ngOnChanges] resume: ');
    // console.log(JSON.stringify(this.resume));
    //this.calculateProgress();
  }

  /**
   * Recupera a configuração dos alertas
   */
  getSettings() {

    this.settings = this.authenticationService.currentSettings();
    //console.log(this.settings);
  }

  calculateProgress() {

    let base = parseFloat(this.resume.qtd_in_incorrect_cp + this.resume.qtd_permanence_time_exceeded);

    if (base > 0) {

      //console.log(this.settings);

      //Categoria em pontos de controle
      this.progressControle[0] = this.settings.enable_local_incorreto ? ((parseFloat(this.resume.qtd_in_incorrect_cp) / base) * 100) : 0;
      this.progressControle[1] = ((parseFloat(this.resume.qtd_permanence_time_exceeded) / base) * 100);
      this.progressControle[2] = (100 - this.progressControle[0] - this.progressControle[1]);

    } else {
      this.progressControle = [0, 0, 100];
    }

    //console.log(this.progressControle);
  }

  /**
   * Get the list of incorrect local
   */
  getListIncorrectLocal() {

    this.homeService.getHomeStatus('local_incorreto').subscribe(result => {
      this.listIncorrectLocal = result;
    }, err => { console.log(err) });
  }

  /**
   * Get the list ofpermanence time exceeded
   */
  getListPermanenceTime() {
    this.homeService.getPermanenceTimeExceeded().subscribe(result => {
      this.listPermanenceTime = result;
      //console.log('PERMANENCE_EXCEEDED: ' + JSON.stringify(this.listPermanenceTime));
    }, err => { console.log(err) });
  }

}


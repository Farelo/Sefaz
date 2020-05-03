import { Component, OnInit, Input } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { HomeService } from '../../../servicos/home.service';
import { AuthenticationService } from 'app/servicos/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categoria-em-viagem',
  templateUrl: './categoria-em-viagem.component.html',
  styleUrls: ['./categoria-em-viagem.component.css']
})
export class CategoriaEmViagemComponent implements OnInit {

  @Input() resume: any;

  public progressEmViagem: any = [];

  public listLate: any[] = [];
  public listMissing: any[] = [];

  public listLateActualPage: number = -1;
  public listMissingActualPage: number = -1;

  public settings: any = {};

  constructor(public translate: TranslateService,
    private homeService: HomeService,
    private authenticationService: AuthenticationService) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

  ngOnInit() {

    this.getSettings();
    this.getListLate();
    this.getListMissing();
    this.calculateProgress();
  }

  ngOnChanges() {


  }

  /**
   * Recupera a configuração dos alertas
   */
  getSettings() {

    this.settings = this.authenticationService.currentSettings();
  }

  calculateProgress() {

    let base = parseFloat(this.resume.qtd_traveling_late + this.resume.qtd_traveling_missing);

    if (base > 0) {

      //Categoria em pontos de controle
      this.progressEmViagem[0] = this.settings.enable_viagem_atrasada ? ((parseFloat(this.resume.qtd_traveling_late) / base) * 100) : 0;
      this.progressEmViagem[1] = this.settings.enable_viagem_perdida ? ((parseFloat(this.resume.qtd_traveling_missing) / base) * 100) : 0;
      this.progressEmViagem[2] = (100 - this.progressEmViagem[0] - this.progressEmViagem[1]);

    } else {
      this.progressEmViagem = [0, 0, 100];
    }

    //console.log(this.progressEmViagem);
  }

  getListLate() {
    this.homeService.getHomeStatus('viagem_atrasada').subscribe(result => {
      this.listLate = result;
    }, err => { console.log(err) });
  }

  getListMissing() {
    this.homeService.getHomeStatus('viagem_perdida').subscribe(result => {
      this.listMissing = result;
    }, err => { console.log(err) });
  }
}
import { Component, OnInit, NgZone } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserComponent } from '../../shared/modal-user/modal-user.component';
import { ModalSettings } from '../../shared/modal-settings/modal-settings.component';
import { AuthenticationService, SettingsService, ToastService } from '../../servicos/index.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public menuAparecer: boolean = false;
  public currentUser: any;
  private languages: any[];
  private actualSettings: any;
  private selectedLang: any = '';

  constructor(public translate: TranslateService,
    private settingsService: SettingsService,
    private toastService: ToastService,
    private ngZone: NgZone,
    private fb: FormBuilder,
    private modalService: NgbModal,
    public authenticationService: AuthenticationService,
    private router: Router) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');

    this.languages = [
      { label: this.translate.instant('MISC.PORTUGUESE'), name: 'pt', icon: '../../../assets/images/flag-br-32.png' },
      { label: this.translate.instant('MISC.ENGLISH'), name: 'en', icon: '../../../assets/images/flag-us-32.png' },
      { label: this.translate.instant('MISC.SPANISH'), name: 'es', icon: '../../../assets/images/flag-es-32.png' }
    ]

    // this.langForm = this.fb.group({
    //   lang: '',
    // });
  }

  ngOnInit() {
    // this.funcaoTop(); 
    this.menuAparecer = false;
    this.currentUser = this.authenticationService.currentUser();
    this.loadLang();
  }

  loadLang() {
    this.settingsService.getSettings().subscribe(result => {
      this.actualSettings = result;

      let actualLang = this.languages.find(elem => elem.name == result.language);
      if (actualLang == undefined) {
        actualLang = this.languages.find(elem => elem.name == 'pt');
        this.translate.use('pt');
      }
      this.actualSettings.language = actualLang.name;
      this.selectedLang = actualLang.name;

      // this.langForm.controls.lang.setValue(actualLang);
      // console.log(this.actualSettings);
    })
  }

  changeLanguage(event) { 
    console.log(this.selectedLang)
    this.actualSettings.language = this.selectedLang;
    console.log(this.actualSettings)
    
    this.settingsService.editSetting({ language: this.selectedLang }, this.actualSettings._id).subscribe(result => {
      
      this.authenticationService.updateCurrentSettings(this.actualSettings);
      this.toastService.edit('', this.translate.instant('MISC.TOAST.SETTINGS'));

      console.log('instant: ', this.translate.instant('MISC.PORTUGUESE'))
      this.languages = [
        { label: this.translate.instant('MISC.PORTUGUESE'), name: 'pt', icon: '../../../assets/images/flag-br-32.png' },
        { label: this.translate.instant('MISC.ENGLISH'), name: 'en', icon: '../../../assets/images/flag-us-32.png' },
        { label: this.translate.instant('MISC.SPANISH'), name: 'es', icon: '../../../assets/images/flag-es-32.png' }
      ]
    }, err => this.toastService.error(err));
  }

  mudar() {
    this.menuAparecer = !this.menuAparecer;
  }

  openModal() {
    //this.mudar();
    const modalRef = this.modalService.open(ModalUserComponent, { backdrop: "static", size: "lg" });
    modalRef.componentInstance.view = 'GERENCIAR';
  }

  openModalEditar() {
    //this.mudar();
  }

  openSettings() {
    //this.mudar();
    const modalRef = this.modalService.open(ModalSettings, { size: "lg" });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  onResize(event) {
    if (event.target.innerWidth > 890) {
      this.menuAparecer = false;
    }
  }
}
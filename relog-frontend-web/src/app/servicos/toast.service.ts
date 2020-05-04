import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Tag } from '../shared/models/tag';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ToastService {

  constructor(
    public translate: TranslateService,
    private router: Router,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private route: ActivatedRoute) { 

      if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
    }

  warningunathorized() {
    // Add see all possible types in one shot

      var toastOptions: ToastOptions = {
        title: "Erro na autenticação",
        msg: "Login ou Senha estão invalidos",
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast: ToastData) => {
          //console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function (toast: ToastData) {
          //console.log('Toast ' + toast.id + ' has been removed!');
        }
      };
    
    this.toastyService.warning(toastOptions);
  }

  error(status: any) {
    // Add see all possible types in one shot
   
    
    console.log(status.error.error)
      var toastOptions: ToastOptions = {
        title: "Erro no cadastro!",
        msg: status.error.error,
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast: ToastData) => {
          //console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast: ToastData) {
          //console.log('Toast ' + toast.id + ' has been removed!');
        }
      };
    
    this.toastyService.error(toastOptions);
  }


  errorArray(status: any) {
    // Add see all possible types in one shot

    if(status.status.errmsg){
      var toastOptions: ToastOptions = {
        title: "Erro no cadastro",
        msg: "Elementos ja foram registrados!",
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast: ToastData) => {
          //console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast: ToastData) {
          //console.log('Toast ' + toast.id + ' has been removed!');
        }
      };
    }else{
      var toastOptions: ToastOptions = {
        title: "Erro na criação",
        msg: "Avalie se as informações cadastradas estão corretas, pois existem inconsistências!",
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast: ToastData) => {
          //console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast: ToastData) {
          //console.log('Toast ' + toast.id + ' has been removed!');
        }
      };
    }

    this.toastyService.error(toastOptions);

  }


  success(route:string, type: string){
    var toastOptions:ToastOptions = {
        title: this.translate.instant('MISC.TOAST.DEFAULT_REGISTERED'),
        msg: type + " " + this.translate.instant('MISC.TOAST.DEFAULT_REGISTERED_DESC'),
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast:ToastData) => {
          //console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
          //console.log('Toast ' + toast.id + ' has been removed!');
        }
    };
     this.toastyService.success(toastOptions);
     this.router.navigate([route]);
  }

  successArray(route:string, type: string){
    var toastOptions:ToastOptions = {
        title: this.translate.instant('MISC.TOAST.DEFAULT_PLURAL_FEMALE_REGISTERED'),
        msg: this.translate.instant('MISC.TOAST.ALL_PLURAL_FEMALE') + " " + type + " " + this.translate.instant('MISC.TOAST.DEFAULT_PLURAL_FEMALE_REGISTERED_DESC'),
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast:ToastData) => {
          //console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
          //console.log('Toast ' + toast.id + ' has been removed!');
        }
    };
     this.toastyService.success(toastOptions);
     if(route != ''){
        this.router.navigate([route]);
     }
  }

  remove(route:string, type: string, female:boolean = false){
    var toastOptions:ToastOptions = {
        title: this.translate.instant('MISC.TOAST.DEFAULT_REMOVED'),
        msg: type + " " + this.translate.instant('MISC.TOAST.DEFAULT_REMOVED_DESC'),
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast:ToastData) => {
          //console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
          //console.log('Toast ' + toast.id + ' has been removed!');
        }
    };

    if(female){
      toastOptions.title = this.translate.instant('MISC.TOAST.DEFAULT_FEMALE_REMOVED');
      toastOptions.msg = type + " " + this.translate.instant('MISC.TOAST.DEFAULT_FEMALE_REMOVED_DESC');
    }

    this.toastyService.success(toastOptions);
    if(route != ''){
      this.router.navigate([route]);
    }
  }

  successModal(type: string, female: boolean = false){
    var toastOptions:ToastOptions = {
        title: this.translate.instant('MISC.TOAST.DEFAULT_REGISTERED'),
        msg: type + " " + this.translate.instant('MISC.TOAST.DEFAULT_REGISTERED_DESC'),
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast:ToastData) => {
          //console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
          //console.log('Toast ' + toast.id + ' has been removed!');
        }
    };

    if (female) {
      toastOptions.title = this.translate.instant('MISC.TOAST.DEFAULT_FEMALE_REGISTERED');
      toastOptions.msg = type + " " + this.translate.instant('MISC.TOAST.DEFAULT_FEMALE_REGISTERED_DESC');
    }

    this.toastyService.success(toastOptions);

  }


  successUpdate(type: string) {
    var toastOptions: ToastOptions = {
      title: this.translate.instant('MISC.TOAST.DEFAULT_UPDATED_TITLE'),
      msg: type + " " + this.translate.instant('MISC.TOAST.DEFAULT_UPDATED_DESC'),
      showClose: true,
      timeout: 5000,
      theme: 'material',
      onAdd: (toast: ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        //console.log('Toast ' + toast.id + ' has been removed!');
      }
    };
    this.toastyService.success(toastOptions);
  }

  edit(route:string, type: string){
    var toastOptions:ToastOptions = {
        title: this.translate.instant('MISC.TOAST.DEFAULT_UPDATED_TITLE'),
        msg: type + " " + this.translate.instant('MISC.TOAST.DEFAULT_UPDATED_DESC'),
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast:ToastData) => {
          //console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
          //console.log('Toast ' + toast.id + ' has been removed!');
        }
    };
     this.toastyService.success(toastOptions);
     if(route != ''){
        this.router.navigate([route]);
     }
  }

  show(route: string, message: { title: string, body: string }) {
    var toastOptions: ToastOptions = {
      title: message.title,
      msg: message.body,
      showClose: true,
      timeout: 5000,
      theme: 'material'
    };
    this.toastyService.success(toastOptions);
    if (route !== '') {
      this.router.navigate([route]);
    }
  }

  showError(route: string, message: { title: string, body: string }) {
    var toastOptions: ToastOptions = {
      title: message.title,
      msg: message.body,
      showClose: true,
      timeout: 5000,
      theme: 'material'
    };
    this.toastyService.error(toastOptions);
    if (route !== '') {
      this.router.navigate([route]);
    }
  }


}

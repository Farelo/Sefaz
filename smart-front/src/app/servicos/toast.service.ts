import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { Tag } from '../shared/models/tag';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Injectable()
export class ToastService {

  constructor(
    private router: Router,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private route: ActivatedRoute
  ) { }

  error(status: any) {
    // Add see all possible types in one shot

    if(status.status.errmsg){
      var toastOptions: ToastOptions = {
        title: "Erro no cadastro",
        msg: "Elemento ja foi registrado",
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast: ToastData) => {
          console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast: ToastData) {
          console.log('Toast ' + toast.id + ' has been removed!');
        }
      };
    }else{
      var toastOptions: ToastOptions = {
        title: "Erro no cadastro!",
        msg: status.status,
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast: ToastData) => {
          console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast: ToastData) {
          console.log('Toast ' + toast.id + ' has been removed!');
        }
      };
    }
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
          console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast: ToastData) {
          console.log('Toast ' + toast.id + ' has been removed!');
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
          console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast: ToastData) {
          console.log('Toast ' + toast.id + ' has been removed!');
        }
      };
    }

    this.toastyService.error(toastOptions);

  }


  success(route:string, type: string){
    var toastOptions:ToastOptions = {
        title: "Cadastrado com successo",
        msg: type + " Cadastrado no sistema com sucesso!",
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast:ToastData) => {
            console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
            console.log('Toast ' + toast.id + ' has been removed!');
        }
    };
     this.toastyService.success(toastOptions);
     this.router.navigate([route]);
  }

  successArray(route:string, type: string){
    var toastOptions:ToastOptions = {
        title: "Cadastradas com sucesso ",
        msg: "Todas as "+ type + " foram cadastradas/os com sucesso no sistema!",
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast:ToastData) => {
            console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
            console.log('Toast ' + toast.id + ' has been removed!');
        }
    };
     this.toastyService.success(toastOptions);
     if(route != ''){
        this.router.navigate([route]);
     }
  }

  remove(route:string, type: string){
    var toastOptions:ToastOptions = {
        title: "Removido com sucesso ",
        msg: type + " foi removido com sucesso do sistema!",
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast:ToastData) => {
            console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
            console.log('Toast ' + toast.id + ' has been removed!');
        }
    };
     this.toastyService.success(toastOptions);
     if(route != ''){
        this.router.navigate([route]);
     }

  }

  successModal(type: string){
    var toastOptions:ToastOptions = {
        title: "Cadastrado com sucesso ",
        msg: type + " cadastrado com suscesso no sistema!",
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast:ToastData) => {
            console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
            console.log('Toast ' + toast.id + ' has been removed!');
        }
    };
     this.toastyService.success(toastOptions);

  }


  edit(route:string, type: string){
    var toastOptions:ToastOptions = {
        title: "Atualização com sucesso ",
        msg: type + " foi autilizado com sucesso no sistema!",
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast:ToastData) => {
            console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function(toast:ToastData) {
            console.log('Toast ' + toast.id + ' has been removed!');
        }
    };
     this.toastyService.success(toastOptions);
     if(route != ''){
        this.router.navigate([route]);
     }

  }




}

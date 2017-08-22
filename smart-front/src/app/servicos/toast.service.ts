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
        title: "Error to create",
        msg: "Element already register",
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
        title: "Error to create",
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

    this.toastyService.error(toastOptions);

  }


  success(route:string, type: string){
    var toastOptions:ToastOptions = {
        title: "Created successfully ",
        msg: type + " inserted successfully into the sistema!",
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


  edit(route:string, type: string){
    var toastOptions:ToastOptions = {
        title: "Updated successfully ",
        msg: type + " updated successfully into the sistema!",
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




}

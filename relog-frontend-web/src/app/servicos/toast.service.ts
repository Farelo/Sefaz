import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { HttpClient, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Tag } from "../shared/models/tag";
import { environment } from "../../environments/environment";
import { Router, ActivatedRoute } from "@angular/router";
import {
  ToastyService,
  ToastyConfig,
  ToastOptions,
  ToastData,
} from "ng2-toasty";

@Injectable()
export class ToastService {
  constructor(
    private router: Router,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private route: ActivatedRoute
  ) {}

  warningExpiredContract() {
    var toastOptions: ToastOptions = {
      title: "Contrato expirado",
      msg:
        "Verifique a validade do seu contrato. Entre em contato através do email contato@evoy.io",
      showClose: true,
      timeout: 5000,
      theme: "material",
      onAdd: (toast: ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        //console.log('Toast ' + toast.id + ' has been removed!');
      },
    };

    this.toastyService.warning(toastOptions);
  }

  warningunathorized() {
    // Add see all possible types in one shot

    var toastOptions: ToastOptions = {
      title: "Erro na autenticação",
      msg: "Login ou Senha estão invalidos",
      showClose: true,
      timeout: 5000,
      theme: "material",
      onAdd: (toast: ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        //console.log('Toast ' + toast.id + ' has been removed!');
      },
    };

    this.toastyService.warning(toastOptions);
  }

  error(status: any) {
    // Add see all possible types in one shot

    console.log(status.error.error);
    var toastOptions: ToastOptions = {
      title: "Erro no cadastro!",
      msg: status.error.error,
      showClose: true,
      timeout: 5000,
      theme: "material",
      onAdd: (toast: ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        //console.log('Toast ' + toast.id + ' has been removed!');
      },
    };

    this.toastyService.error(toastOptions);
  }

  errorArray(status: any) {
    // Add see all possible types in one shot

    if (status.status.errmsg) {
      var toastOptions: ToastOptions = {
        title: "Erro no cadastro",
        msg: "Elementos ja foram registrados!",
        showClose: true,
        timeout: 5000,
        theme: "material",
        onAdd: (toast: ToastData) => {
          //console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function (toast: ToastData) {
          //console.log('Toast ' + toast.id + ' has been removed!');
        },
      };
    } else {
      var toastOptions: ToastOptions = {
        title: "Erro na criação",
        msg:
          "Avalie se as informações cadastradas estão corretas, pois existem inconsistências!",
        showClose: true,
        timeout: 5000,
        theme: "material",
        onAdd: (toast: ToastData) => {
          //console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function (toast: ToastData) {
          //console.log('Toast ' + toast.id + ' has been removed!');
        },
      };
    }

    this.toastyService.error(toastOptions);
  }

  success(route: string, type: string) {
    var toastOptions: ToastOptions = {
      title: "Cadastrado com successo",
      msg: type + " Cadastrado no sistema com sucesso!",
      showClose: true,
      timeout: 5000,
      theme: "material",
      onAdd: (toast: ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        //console.log('Toast ' + toast.id + ' has been removed!');
      },
    };
    this.toastyService.success(toastOptions);
    this.router.navigate([route]);
  }

  successArray(route: string, type: string) {
    var toastOptions: ToastOptions = {
      title: "Cadastradas com sucesso ",
      msg: "Todas as " + type + " foram cadastradas/os com sucesso no sistema!",
      showClose: true,
      timeout: 5000,
      theme: "material",
      onAdd: (toast: ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        //console.log('Toast ' + toast.id + ' has been removed!');
      },
    };
    this.toastyService.success(toastOptions);
    if (route != "") {
      this.router.navigate([route]);
    }
  }

  remove(route: string, type: string, female: boolean = false) {
    var toastOptions: ToastOptions = {
      title: "Removido com sucesso",
      msg: type + " foi removido com sucesso do sistema!",
      showClose: true,
      timeout: 5000,
      theme: "material",
      onAdd: (toast: ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        //console.log('Toast ' + toast.id + ' has been removed!');
      },
    };

    if (female) {
      toastOptions.title = "Removida com sucesso";
      toastOptions.msg = type + " foi removida com sucesso!";
    }

    this.toastyService.success(toastOptions);
    if (route != "") {
      this.router.navigate([route]);
    }
  }

  successModal(type: string, female: boolean = false) {
    var toastOptions: ToastOptions = {
      title: "Cadastrado com sucesso ",
      msg: type + " cadastrado com sucesso no sistema!",
      showClose: true,
      timeout: 5000,
      theme: "material",
      onAdd: (toast: ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        //console.log('Toast ' + toast.id + ' has been removed!');
      },
    };

    if (female) {
      toastOptions.title = "Cadastrada com sucesso";
      toastOptions.msg = type + " foi cadastrada com sucesso!";
    }

    this.toastyService.success(toastOptions);
  }

  successUpdate(type: string) {
    var toastOptions: ToastOptions = {
      title: "Atualizado com sucesso ",
      msg: type + " atualizado com sucesso no sistema!",
      showClose: true,
      timeout: 5000,
      theme: "material",
      onAdd: (toast: ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        //console.log('Toast ' + toast.id + ' has been removed!');
      },
    };
    this.toastyService.success(toastOptions);
  }

  edit(route: string, type: string) {
    var toastOptions: ToastOptions = {
      title: "Atualização com sucesso ",
      msg: type + " foi autilizado com sucesso no sistema!",
      showClose: true,
      timeout: 5000,
      theme: "material",
      onAdd: (toast: ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        //console.log('Toast ' + toast.id + ' has been removed!');
      },
    };
    this.toastyService.success(toastOptions);
    if (route != "") {
      this.router.navigate([route]);
    }
  }

  show(route: string, message: { title: string; body: string }) {
    var toastOptions: ToastOptions = {
      title: message.title,
      msg: message.body,
      showClose: true,
      timeout: 5000,
      theme: "material",
    };
    this.toastyService.success(toastOptions);
    if (route !== "") {
      this.router.navigate([route]);
    }
  }

  showError(route: string, message: { title: string; body: string }) {
    var toastOptions: ToastOptions = {
      title: message.title,
      msg: message.body,
      showClose: true,
      timeout: 5000,
      theme: "material",
    };
    this.toastyService.error(toastOptions);
    if (route !== "") {
      this.router.navigate([route]);
    }
  }
}

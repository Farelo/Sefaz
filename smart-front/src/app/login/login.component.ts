import { Injectable, EventEmitter } from '@angular/core';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private usuarioAutenticado: boolean = false;

  usuario: any = {
    email: "lalal",
    senha: "lalal"
  };
  constructor() { }

  onSubmit(form){
    console.log(form);
  }
  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.component.html',
  styleUrls: ['./esqueci-minha-senha.component.css']
})
export class EsqueciMinhaSenhaComponent implements OnInit {
  usuario: any = {
    email: null,
    senha: null
  };
  constructor() { }

  ngOnInit() {
  }

}

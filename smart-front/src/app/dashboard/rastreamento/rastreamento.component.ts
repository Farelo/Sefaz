import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rastreamento',
  templateUrl: './rastreamento.component.html',
  styleUrls: ['./rastreamento.component.css']
})
export class RastreamentoComponent implements OnInit {
  title: string = 'My first AGM project';
    lat: number = -8.052444;
    lng: number = -34.886136;
    // lat2: number = -8.050404;
    // lng2: number = -34.886458;
    descri: '<div>lalalalal</div>';

  private arrayDoAmor: any[] = [
    {lat: -8.050404, lng: -34.886458},
    {lat: -8.053421, lng: -34.884982}
  ];

  private lats: number[] = [-8.050404,-8.053421];
  private lngs: number[] = [-34.886458,-34.884982];
  constructor() { }

  ngOnInit() {
  }

}

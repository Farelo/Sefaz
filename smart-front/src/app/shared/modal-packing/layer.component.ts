import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { PackingService } from '../../servicos/packings.service';


@Component({
  selector: 'app-alerta',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerModalComponent implements OnInit {
@Input() packing;
public path = [];
public center: any;
public pos: any;
public inscricao: Subscription;

  constructor(
    public activeLayer: NgbActiveModal,
    private route: ActivatedRoute,
    private packingService: PackingService,
    private router: Router) { }

  ngOnInit() {
    console.log(this.packing);
    this.getPositions();
  }

  getPositions(){
    this.packingService.getPositions(this.packing.code_tag).subscribe(result => {this.center = result.data.positions[0]; this.path = result.data.positions})
  }

  getPosition(event:any){
    console.log(event);
  }
}

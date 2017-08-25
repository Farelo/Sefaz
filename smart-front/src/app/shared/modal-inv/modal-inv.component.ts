import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { InventoryService } from '../../servicos/inventory.service';



@Component({
  selector: 'app-modal-inv',
  templateUrl: './modal-inv.component.html',
  styleUrls: ['./modal-inv.component.css']
})
export class ModalInvComponent implements OnInit {
 @Input() packing;

inscricao: Subscription;
  constructor(
    public activeAlerta: NgbActiveModal,
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private router: Router) { }

  ngOnInit() {
    console.log(this.packing._id);
    this.inventoryService.getInventorySupplierByPlant(10,1,this.packing.code, this.packing.supplier._id).subscribe( result => console.log(result))
  }

}

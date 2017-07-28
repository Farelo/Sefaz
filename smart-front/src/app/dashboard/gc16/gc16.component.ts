import { Component, OnInit } from '@angular/core';
import { GC16Service } from '../../servicos/gc16.service';
import { GC16 } from '../../shared/models/gc16';
import { SuppliersService } from '../../servicos/suppliers.service';
import { PackingService } from '../../servicos/packings.service';


@Component({
  selector: 'app-gc16',
  templateUrl: './gc16.component.html',
  styleUrls: ['./gc16.component.css']
})
export class Gc16Component implements OnInit {

  constructor(
    private GC16Service: GC16Service,
    private SuppliersService: SuppliersService,
    private PackingService: PackingService
  ) { }
  // Local properties
  gc16: GC16[];
    vazio: boolean = false;


  loadGC16() {
    // Get all comments
    this.GC16Service.getGC16sPagination(10, 1)
      .subscribe(
      gc16 => this.gc16 = gc16,
      err => {
        // Log errors if any
        console.log(err);
      });
  }

  //refazer isso daqui, depende de muitas coisas para ser realizada a alteração
  removeGC16(object: any):void{
    this.GC16Service.deleteGC16(object._id)
    .subscribe(result => this.PackingService.updatePackingUnset(object.packing)
    .subscribe(result => this.loadGC16(), err => {console.log(err)}));
  }

  ngOnInit() {
    // Load comments
    this.loadGC16();
  }

}

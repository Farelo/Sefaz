import { Component, OnInit, Input ,ChangeDetectorRef,Output,EventEmitter} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuppliersService } from '../../servicos/suppliers.service';
import { GC16Service } from '../../servicos/gc16.service';
import { ProfileService } from '../../servicos/profile.service';
import { PackingService } from '../../servicos/packings.service';
import { RoutesService } from '../../servicos/routes.service';
import { PlantsService } from '../../servicos/plants.service';
import { ToastService } from '../../servicos/toast.service';
import { CEPService } from '../../servicos/cep.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Supplier } from '../../shared/models/supplier';
import { Profile } from '../../shared/models/profile';
import { Plant } from '../../shared/models/plant';

declare var $:any;

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent implements OnInit {
  @Input() view;
  @Input() type;


  private perfil = 'FORNECEDOR';
  public autocomplete: google.maps.places.Autocomplete;
  public address: any = {};
  public center: any;
  public pos : any;
  public users: any;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private SuppliersService : SuppliersService,
    private ProfileService : ProfileService,
    private PlantsService : PlantsService,
    private CEPService : CEPService,
    private ref: ChangeDetectorRef,
    private packingService: PackingService,
    private toastService: ToastService,
    private routesService: RoutesService,
    private gc16Service: GC16Service,
  ) { }

  ngOnInit() {
    console.log(this.view);
    console.log(this.type);
  }

  delete(){

    if(this.type === 'packing'){
      this.packingService.deletePacking(this.view._id).subscribe( result => {this.toastService.remove('/rc/cadastros/embalagem','Embalagem');this.activeModal.close('remove') });
    }else if(this.type === 'route'){
      this.routesService.deleteRoute(this.view._id).subscribe(result =>  {this.toastService.remove('/rc/cadastros/rotas','Rota');this.activeModal.close('remove') });
    }else if(this.type === 'gc16'){

      this.gc16Service.deleteGC16(this.view._id).subscribe(result => {this.toastService.remove('/rc/gc16','GC16');this.activeModal.close('remove') });
    }
  }


}

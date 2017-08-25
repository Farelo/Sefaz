import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuppliersService } from '../../servicos/suppliers.service';
import { ProfileService } from '../../servicos/profile.service';
import { PlantsService } from '../../servicos/plants.service';
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
  public supplier:  Supplier = new Supplier();
  public plant:  Plant = new Plant();
  public profile:  Profile = new Profile();
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
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log(this.view);
  }


}

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
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
@Input() view;


  private perfil: any;
  public supplier:  Supplier = new Supplier();
  public plant:  Plant = new Plant();
  public profile:  Profile = new Profile();
  public autocomplete: any;
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
    this.getUsers();
    this.tamanho();
  }
  tamanho(){
    var mapa = $('.teste');

    var filho = $('.modalFilho');
    var pai1 = filho.parent();
    var pai2 = pai1.parent();
    var pai3 = pai2.parent();
    pai3.css({'max-width': '800px'});
  }
  getUsers(){
      this.ProfileService.getProfilePagination(10,1).subscribe(result => this.users = result.data);
  }

  openAdd(){
      this.view = 'ADICIONAR';
  }
  closeAdd(){
      this.view = 'GERENCIAR';
      this.perfil ="";
      this.getUsers();

  }
  adicionarUsuario(){
      this.profile.profile = 1;
      this.ProfileService.createProfile(this.profile).subscribe(result => {
        this.supplier.profile = result.data._id;
        this.SuppliersService.createSupplier(this.supplier).subscribe(result => {
          this.plant.supplier = result.data._id;
          this.PlantsService.createPlant(this.plant).subscribe(result => {
            this.SuppliersService.updateSupplier(result.data.supplier, {plant: result.data._id}).subscribe(result => this.closeAdd());
          })
        })
      })
  }

  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }

  placeChanged(place) {
    this.center = place.geometry.location;
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      this.address[addressType] = place.address_components[i].long_name;
    }

    this.ref.detectChanges();
  }

  getAddress(){

    if(this.profile.cep){
      this.CEPService.getAddress(this.profile.cep).subscribe(result => {
          this.profile.neighborhood = result.data.bairro;
          this.profile.city = result.data.localidade;
          this.profile.uf = result.data.uf;
          this.profile.address = result.data.logradouro;
      })
    }
  }

  onClick(event, str) {
      if (event instanceof MouseEvent){
        return;
      }
     this.pos = event.latLng;
     this.plant.lat = event.latLng.lat();
     this.plant.lng = event.latLng.lng();
     event.target.panTo(event.latLng);
  }
  closeAll(){
    this.view='';
  }

}

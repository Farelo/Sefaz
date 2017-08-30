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
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { GeocodingService } from '../../servicos/geocoding.service';
import { ToastService } from '../../servicos/toast.service';
declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
@Input() view;


  private perfil = 'FORNECEDOR';
  public supplier:  FormGroup;;
  public geocoder = new google.maps.Geocoder;
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
    private fb: FormBuilder,
    private geocodingService: GeocodingService,
    private toastService: ToastService

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
      this.supplier = this.fb.group({
        name: ['',[Validators.required]],
        duns: ['',[Validators.required]],
        cnpj: [''],
        profile: this.fb.group({
          profile: ['',[Validators.required]],
          password: ['',[Validators.required]],
          email: ['',[Validators.required, Validators.email]],
          street: ['',[Validators.required]],
          city: ['',[Validators.required]],
          telephone: [''],
          cellphone: [''],
          neighborhood: ['',[Validators.required]],
          uf: ['',[Validators.required]],
          cep: ['',[Validators.required]]
        }),
        plant: this.fb.group({
          plant_name: ['',[Validators.required]],
          lat: ['',[Validators.required]],
          lng: ['',[Validators.required]],
          location: ['',[Validators.required]]
        })
      });
  }
  closeAdd(){
      this.view = 'GERENCIAR';
      this.perfil ="";
      this.getUsers();
  }
  onSubmit({ value, valid }: { value: Supplier, valid: boolean }):void {

      this.supplier['controls'].profile['controls'].profile.setValue(1);

      if(this.supplier.valid){
        this.ProfileService.createProfile(this.supplier.value.profile).subscribe(result => {
          this.supplier.value.profile = result.data._id;
          this.PlantsService.createPlant(this.supplier.value.plant).subscribe(result => {
            this.supplier.value.plant = result.data._id;
            this.SuppliersService.createSupplier(this.supplier.value).subscribe(result => {
              this.PlantsService.updatePlant(result.data.plant, {supplier: result.data._id}).subscribe(result => {this.toastService.successModal('Fornecedor');this.closeAdd()}, err => this.toastService.error(err));
            })

          })
        })
      }

  }

  onMapReady(map) {
    let origin  = new google.maps.LatLng(map.center.lat(), map.center.lng());
    this.geocodingService.geocode(origin).subscribe(results => {
      console.log(results[1].address_components.filter(o => o.types.indexOf("postal_code") == 0 ));
      this.supplier['controls'].profile['controls'].cep.setValue(results[1].address_components.filter(o => o.types.indexOf("postal_code") == 0 )[0].long_name);
      this.supplier['controls'].plant['controls'].location.setValue(results[1].formatted_address);
      this.supplier.controls.plant['controls'].lat.setValue(map.center.lat());
      this.supplier.controls.plant['controls'].lng.setValue(map.center.lng());
      this.getAddress();
    });

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
    console.log("aqui");
    if(this.supplier['controls'].profile['controls'].cep.value){
      this.CEPService.getAddress(this.supplier['controls'].profile['controls'].cep.value).subscribe(result => {
         this.supplier['controls'].profile['controls'].neighborhood.setValue(result.data.bairro);
         this.supplier['controls'].profile['controls'].city.setValue( result.data.localidade);
         this.supplier['controls'].profile['controls'].uf.setValue(result.data.uf);
         this.supplier['controls'].profile['controls'].street.setValue(result.data.logradouro);
      })
    }
  }

  onClick(event, str) {
      if (event instanceof MouseEvent){
        return;
      }
     this.pos = event.latLng;
     this.geocodingService.geocode(event.latLng).subscribe(results => {
       console.log("depois");
       this.supplier['controls'].profile['controls'].cep.setValue(results[1].address_components.filter(o => o.types.indexOf("postal_code") == 0 )[0].long_name);
       this.supplier['controls'].plant['controls'].location.setValue(results[1].formatted_address);
       this.supplier['controls'].plant['controls'].lat.setValue(event.latLng.lat());
       this.supplier['controls'].plant['controls'].lng.setValue(event.latLng.lng());
       event.target.panTo(event.latLng);
       this.getAddress();
     });

  }
  closeAll(){
    this.view='';
  }

}

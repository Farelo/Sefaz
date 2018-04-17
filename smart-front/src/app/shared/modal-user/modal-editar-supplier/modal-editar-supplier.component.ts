import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserComponent } from '../modal-user.component';
import { Supplier } from '../../../shared/models/supplier';
import { Profile } from '../../../shared/models/profile';
import { Plant } from '../../../shared/models/plant';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { ToastService, GeocodingService, AuthenticationService, LogisticService, CEPService, PlantsService, ProfileService, SuppliersService } from '../../../servicos/index.service';

declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-editar-supplier.component.html',
  styleUrls: ['./modal-editar-supplier.component.css']
})
export class ModalSupplierEditarComponent implements OnInit {
  @Input() id;

  public next = false;
  public supplier:  FormGroup;
  public plant:  FormGroup;
  public geocoder = new google.maps.Geocoder;
  public autocomplete: google.maps.places.Autocomplete;
  public address: any = {};
  public submitted = false;
  public invalidEmail = false;
  public invalidDuns = false;
  public invalidPlant = false;
  public center: any;
  public pos : any;
  public mask = [/[0-9]/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'-', /\d/, /\d/];
  public maskCep = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskTel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];
  public maskCel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];


  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private SuppliersService : SuppliersService,
    private ProfileService : ProfileService,
    private authenticationService : AuthenticationService,
    private PlantsService : PlantsService,
    private CEPService : CEPService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private geocodingService: GeocodingService,
    private toastService: ToastService

  ) { }

  ngOnInit() {
    this.formProfile();
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

  formProfile(){

      this.supplier = this.fb.group({
        name: ['',[Validators.required]],
        duns: ['',[Validators.required]],
        cnpj: [''],
        plant: [''],
        profile: this.fb.group({
          profile: ['',[Validators.required]],
          password: ['',[Validators.required]],
          email: ['',[Validators.required, Validators.email]],
          user: ['',[Validators.required]],
          street: ['',[Validators.required]],
          city: ['',[Validators.required]],
          telephone: [''],
          cellphone: [''],
          neighborhood: ['',[Validators.required]],
          uf: ['',[Validators.required]],
          cep: ['',[Validators.required]],
          _id: ['',[Validators.required]],
          __v: ['',[Validators.required]]
        }),
        _id: ['',[Validators.required]],
        __v: ['',[Validators.required]]
      });


    this.plant = this.fb.group({
      plant_name: ['',[Validators.required]],
      lat: ['',[Validators.required]],
      lng: ['',[Validators.required]],
      location: ['',[Validators.required]],
      supplier: [''],
      _id: ['',[Validators.required]],
      __v: ['',[Validators.required]]
    });


      this.SuppliersService.retrieveSupplier(this.id).subscribe(response => {
        let result = response.data;
        (this.supplier)
                .patchValue(result, { onlySelf: true });

        (this.plant)
                .setValue(result.plant, { onlySelf: true });

        this.center = { lat: this.plant.controls.lat.value, lng: this.plant.controls.lng.value };
        this.pos = [this.plant.controls.lat.value,this.plant.controls.lng.value];

      })

  }

  evaluateEmail(){
    if(this.supplier['controls'].profile['controls'].email.value){
      this.ProfileService.retrieveProfileByEmail(this.supplier['controls'].profile['controls'].email.value).subscribe(result => {

        if(result.data.length > 0) {
          this.invalidEmail = true;
        }else{
          this.invalidEmail = false;
        };
      });
    }

  }

  evaluateDuns(){
    this.SuppliersService.retrieveSupplierByDunsAndSupplier(this.supplier['controls'].duns.value,this.supplier['controls'].name.value).subscribe(result => {

      if(result.data.length > 0) {
        this.invalidDuns = true;
      }else{
        this.invalidDuns = false;
      };
    });
  }

  evaluateForm(){
    if(this.supplier.valid){
      this.next = true;
    }else{
      this.submitted = true;
    }
  }


  evaluatePlant(){
    this.PlantsService.retrievePlantByName(this.plant['controls'].plant_name.value).subscribe(result => {
      if(result.data.length > 0) {
        this.invalidPlant = true;
      }else{
        this.invalidPlant = false;
      };
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }):void {

    let supplier = this.supplier.value;

    if(valid && !this.invalidPlant){

      this.ProfileService.updateProfile(supplier.profile._id,supplier.profile).subscribe(result => {
        this.PlantsService.updatePlant(value._id,value).subscribe(result => {
          this.SuppliersService.updateSupplier(supplier._id,supplier).subscribe(result => {
            this.toastService.edit('','Fornecedor');
            this.closeModal();
          }, err => this.toastService.error(err))
        })
      })
    }


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

       this.plant['controls'].location.setValue(results[1].formatted_address);
       this.plant['controls'].lat.setValue(event.latLng.lat());
       this.plant['controls'].lng.setValue(event.latLng.lng());
       event.target.panTo(event.latLng);

     });

  }


  closeModal(){

      const modalRef = this.modalService.open(ModalUserComponent,{backdrop: "static", size: "lg"});
      this.activeModal.close();

  }



}

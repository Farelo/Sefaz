import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuppliersService } from '../../../servicos/suppliers.service';
import { ProfileService } from '../../../servicos/profile.service';
import { PlantsService } from '../../../servicos/plants.service';
import { CEPService } from '../../../servicos/cep.service';
import { ModalUserComponent } from '../modal-user.component';
import { ModalLogisticRegisterComponent } from '../modal-register-logistic/modal-register-logistic.component';
import { ModalStaffRegisterComponent } from '../modal-register-staff/modal-register-staff.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { GeocodingService } from '../../../servicos/geocoding.service';
import { LogisticService } from '../../../servicos/logistic.service';
import { ToastService } from '../../../servicos/toast.service';
import { constants } from '../../../../environments/constants';

declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-register-supplier.component.html',
  styleUrls: ['./modal-register-supplier.component.css']
})
export class ModalSupplierRegisterComponent implements OnInit {

  public next = false;
  public supplier:  FormGroup;
  public plant:  FormGroup;
  public perfil = constants.profile.supplier;
  public geocoder = new google.maps.Geocoder;
  public autocomplete: google.maps.places.Autocomplete;
  public address: any = {};
  public submitted= false;
  public invalidEmail = false;
  public invalidDuns = false;
  public invalidPlant = false;
  public center: any;
  public pos : any;
  public users = [];
  public newcep = '';
  public newtelefone = '';
  public mask = [/[0-9]/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'-', /\d/, /\d/];
  public maskCep = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskTel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];
  public maskCel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];


  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
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
      plant: [''],
      cnpj: [''],
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
        cep: ['',[Validators.required]]
      })
    });


    this.plant = this.fb.group({
      plant_name: ['',[Validators.required]],
      lat: ['',[Validators.required]],
      lng: ['',[Validators.required]],
      location: ['',[Validators.required]]
    })

    this.supplier['controls'].profile['controls'].profile.setValue(constants.SUPPLIER);
  }


  onChange(event){
    if(event == constants.profile.logistic){
      const modalRef = this.modalService.open(ModalLogisticRegisterComponent,{backdrop: "static", size: "lg"});
      this.activeModal.close();
    }else if(event === constants.profile.staff){
      const modalRef = this.modalService.open(ModalStaffRegisterComponent,{backdrop: "static", size: "lg"});
      this.activeModal.close();
    }
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
    if (this.supplier.valid && !this.invalidEmail){
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
        this.ProfileService.createProfile(supplier.profile).subscribe(result => {
          supplier.profile._id =  result.data._id;
          this.PlantsService.createPlant(value).subscribe(result => {
            value._id = result.data._id;
            supplier.plant = value;

            this.SuppliersService.createSupplier(supplier).subscribe(result => {
              value.supplier = result.data._id ;
              this.PlantsService.updatePlant(result.data.plant, value).subscribe(result => {
                this.toastService.successModal('Fornecedor');
                this.closeModal();
             }, err => this.toastService.error(err));
            })

          })
        })
    }
  }


  onMapReady(map) {
    let origin  = new google.maps.LatLng(map.center.lat(), map.center.lng());

    this.geocodingService.geocode(origin).subscribe(results => {
      this.plant['controls'].location.setValue(results[1].formatted_address);
      this.plant['controls'].lat.setValue(map.center.lat());
      this.plant['controls'].lng.setValue(map.center.lng());
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
    modalRef.componentInstance.view = 'GERENCIAR';
    this.activeModal.close();
  }



}

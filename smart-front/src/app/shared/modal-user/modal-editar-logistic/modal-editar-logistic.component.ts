import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuppliersService } from '../../../servicos/suppliers.service';
import { ProfileService } from '../../../servicos/profile.service';
import { PlantsService } from '../../../servicos/plants.service';
import { CEPService } from '../../../servicos/cep.service';
import { ModalUserComponent } from '../modal-user.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Supplier } from '../../../shared/models/supplier';
import { LogisticService } from '../../../servicos/logistic.service';
import { Profile } from '../../../shared/models/profile';
import { Plant } from '../../../shared/models/plant';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { GeocodingService } from '../../../servicos/geocoding.service';
import { ToastService } from '../../../servicos/toast.service';

declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-editar-logistic.component.html',
  styleUrls: ['./modal-editar-logistic.component.css']
})
export class ModalLogisticEditarComponent implements OnInit {
  @Input() id;

  public dropdownList = [];
  public selectedItems = [];
  public dropdownSettings = {};
  public next = false;
  public logistic:  FormGroup;
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
  public users = [];
  public newcep = '';
  public newtelefone = '';
  public mask = [/[0-9]/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'-', /\d/, /\d/];
  public maskCep = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskTel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];
  public maskCel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];
  public alerts: any = [];

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
    private logisticService: LogisticService,
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

      this.logistic = this.fb.group({
        name: ['',[Validators.required]],
        suppliers: [''],
        plant : [],
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
      logistic_operator: [''],
      _id: ['',[Validators.required]],
      __v: ['',[Validators.required]]
    });


    this.logisticService.retrieveLogistic(this.id).subscribe(response => {
      let result = response.data;

      console.log(result);
      (this.logistic)
                .patchValue(result, { onlySelf: true });

      (this.plant)
                .setValue(result.plant, { onlySelf: true });

      console.log(this.plant);
      this.center = { lat: this.plant.controls.lat.value, lng: this.plant.controls.lng.value };
      this.pos = [this.plant.controls.lat.value,this.plant.controls.lng.value];
        this.loadSuppliers();
    })

  }

  loadSuppliers(): void {
    this.SuppliersService.retrieveAll().subscribe(result => {
      this.dropdownList = result.data.map(o => {
        return {'id': o._id, 'itemName': 'DUNS:'+ o.duns+ ' Nome:'+ o.name};
      });
      let map = this.logistic['controls'].suppliers.value.map(op => String(op._id));
      this.logistic['controls'].suppliers.setValue(this.dropdownList.filter(o => map.indexOf(String(o.id)) != -1))

      this.dropdownSettings = {
                                  singleSelection: false,
                                  text:"Selecione os Fornecedores",
                                  enableSearchFilter: true,
                                  badgeShowLimit: 2,
                                  searchPlaceholderText: "Pesquisar"
                                };
    }, err => { console.log(err) });
  }


  evaluateEmail(){
    if(this.logistic['controls'].profile['controls'].email.value){
      this.ProfileService.retrieveProfileByEmail(this.logistic['controls'].profile['controls'].email.value).subscribe(result => {

        if(result.data.length > 0) {
          this.invalidEmail = true;
        }else{
          this.invalidEmail = false;
        };
      });
    }

  }

  evaluateForm(){
    if(this.logistic.valid){
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

      let logistic = this.logistic.value;
      console.log(logistic);
      if(valid && !this.invalidPlant){
        logistic.suppliers = logistic.suppliers.map(o => o.id);
        this.ProfileService.updateProfile(logistic.profile._id,logistic.profile).subscribe(result => {
          this.PlantsService.updatePlant(value._id,value).subscribe(result => {
            console.log(logistic);
            this.logisticService.updateLogistic(logistic._id,logistic).subscribe(result => {
              this.toastService.edit('Operador Logistico','');
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

     if(this.logistic['controls'].profile['controls'].cep.value){
      this.CEPService.getAddress(this.logistic['controls'].profile['controls'].cep.value).subscribe(result => {
         this.logistic['controls'].profile['controls'].neighborhood.setValue(result.data.bairro);
         this.logistic['controls'].profile['controls'].city.setValue( result.data.localidade);
         this.logistic['controls'].profile['controls'].uf.setValue(result.data.uf);
         this.logistic['controls'].profile['controls'].street.setValue(result.data.logradouro);
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

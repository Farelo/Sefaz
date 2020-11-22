import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserComponent } from '../modal-user.component';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { ToastService, LogisticService, GeocodingService, CEPService, PlantsService, ProfileService, SuppliersService } from '../../../servicos/index.service';
import { constants } from '../../../../environments/constants';
declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-register-logistic.component.html',
  styleUrls: ['./modal-register-logistic.component.css']
})
export class ModalLogisticRegisterComponent implements OnInit {

  public dropdownList = [];
  public selectedItems = [];
  public dropdownSettings = {};
  public next = false;
  private perfil = constants.profile.logistic;
  public logistic :  FormGroup;
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
    private logisticService : LogisticService,
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


    this.logistic = this.fb.group({
      name: ['',[Validators.required]],
      suppliers: [[]],
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
        cep: ['',[Validators.required]]
      })
    });

    this.plant = this.fb.group({
      plant_name: ['',[Validators.required]],
      lat: ['',[Validators.required]],
      lng: ['',[Validators.required]],
      location: ['',[Validators.required]]
    })

    this.logistic['controls'].profile['controls'].profile.setValue(constants.LOGISTIC);
    this.loadSuppliers();
  }


  onChange(event){

    if(event == constants.profile.supplier){
      this.activeModal.close();
    }else if(event === constants.profile.staff){
      this.activeModal.close();
    }
  }

  loadSuppliers(): void {
    this.SuppliersService.retrieveAll().subscribe(result => {
      this.dropdownList = result.data.map(o => {
        return {'id': o._id, 'itemName': 'DUNS:'+ o.duns+ ' Nome:'+ o.name};
      });
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
    if (this.logistic.valid && !this.invalidEmail){
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


      if(valid && !this.invalidPlant){
        logistic.suppliers = logistic.suppliers.map(o => o.id);

        this.ProfileService.createProfile(logistic.profile).subscribe(result => {
          logistic.profile =  result.data._id;
          this.PlantsService.createPlant(value).subscribe(result => {
            value._id = result.data._id;
            logistic.plant = value;

            this.logisticService.createLogistic(logistic).subscribe(result => {
              value.logistic_operator = result.data._id ;

              this.PlantsService.updatePlant(result.data.plant, value).subscribe(result => {
                this.toastService.successModal('Operador Logistico');

                this.closeModal();
             }, err => this.toastService.error(err));
            })

          })
        })
      }


  }

  onItemSelect(item:any){
    //console.log(item);
  }

  OnItemDeSelect(item:any){
    //console.log(item);
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

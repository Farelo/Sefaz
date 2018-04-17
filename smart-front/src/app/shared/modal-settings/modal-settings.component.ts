import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { SettingsService, AuthenticationService, ToastService, CEPService, ProfileService } from '../../servicos/index.service';
import { MeterFormatter} from '../pipes/meter_formatter'
import { WeekFormatter} from '../pipes/week_formatter'
import { ChargeFormatter} from '../pipes/charge_formatter'

declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-settings.component.html',
  styleUrls: ['./modal-settings.component.css']
})
export class ModalSettings implements OnInit {


  public settings :  FormGroup;


  public someMeterConfig: any = {
    range: {
      min: 0,
      max: 4
    },
    tooltips: new MeterFormatter(),
    step: 0.0001
  };

  public someWeekConfig: any = {
    range: {
      min: 604800000,
      max: 36288000000
    },
    tooltips: new WeekFormatter(),
    step: 604800000
  };
  
  public someChargeConfig: any = {
    range: {
      min: 0,
      max: 100
    },
    tooltips: new ChargeFormatter(),
    step: 1
  };

  constructor(
    public activeModal: NgbActiveModal,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
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
    pai3.css({'max-width': '600px'});
  }


  formProfile(){


    this.settings = this.fb.group({
      battery_level: ['',[Validators.required]],
      range_radius: ['',[Validators.required]],
      clean: ['',[Validators.required]],
      register_gc16: this.fb.group({
        enable: [Boolean],
        id: [String],
        days: [Number]
      }),
        _id: ['',[Validators.required]],
        __v: ['',[Validators.required]]

      });

    this.settingsService.retrieve().subscribe(response => {
        let result = response.data[0];
        (this.settings)
                  .patchValue(result, { onlySelf: true });

      })

  }

  onSubmit({ value, valid }: { value: any, valid: boolean }):void {

      if(valid ){

        this.settingsService.update(value).subscribe(result => {
            this.toastService.edit('','Configurações');
            this.closeModal();
            this.authenticationService.updateCurrentUser();
             }, err => this.toastService.error(err));

      }

  }

  closeModal(){
      this.activeModal.close();
  }


}

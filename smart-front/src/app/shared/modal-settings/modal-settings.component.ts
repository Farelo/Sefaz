import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SettingsService, AuthenticationService, ToastService, CEPService, ProfileService } from '../../servicos/index.service';
import { MeterFormatter } from '../pipes/meter_formatter'
import { WeekFormatter } from '../pipes/week_formatter'
import { ChargeFormatter } from '../pipes/charge_formatter'

declare var $: any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-settings.component.html',
  styleUrls: ['./modal-settings.component.css']
})
export class ModalSettings implements OnInit {

  //Form group
  public settings: FormGroup;

  private actualSettings: any;

  //Bateria
  public batteryConfig: any = {
    connect: [true, false],
    range: {
      min: 0,
      max: 100
    },
    tooltips: new ChargeFormatter(),
    step: 1
  };

  //Acurácia 
  public accuracyConfig: any = {
    connect: [true, false],
    range: {
      min: 0,
      max: 32
    },
    tooltips: new MeterFormatter(),
    step: 0.1
  };

  //Raio da Planta
  public radiusConfig: any = {
    connect: [true, false],
    range: {
      min: 0,
      max: 4
    },
    tooltips: new MeterFormatter(),
    step: 0.01
  };

  //
  public someWeekConfig: any = {
    range: {
      min: 604800000,
      max: 36288000000
    },
    tooltips: new WeekFormatter(),
    step: 604800000
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
  }

  formProfile() {

    // this.settings = this.fb.group({
    //   battery_level: ['', [Validators.required]],
    //   range_radius: ['', [Validators.required]],
    //   clean: ['', [Validators.required]],
    //   register_gc16: this.fb.group({
    //     enable: [Boolean],
    //     id: [String],
    //     days: [Number]
    //   }),
    //   _id: ['', [Validators.required]],
    //   __v: ['', [Validators.required]]
    // });

    this.settings = this.fb.group({
      enable_gc16: [false, [Validators.required]],
      battery_level_limit: [0, [Validators.required]],
      accuracy_limit: [0, [Validators.required]],
      job_schedule_time_in_sec: [0, [Validators.required]],
      range_radius: [0, [Validators.required]],
      clean_historic_moviments_time: [0, [Validators.required]],
      no_signal_limit_in_days: [0, [Validators.required]]
    });

    this.settingsService.getSetting().subscribe(result => {

      this.actualSettings = result;
      (this.settings).patchValue(result, { onlySelf: true });
    })
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    console.log(value);
    console.log(this.actualSettings);

    if (valid) {

      this.settingsService.editSetting(value, this.actualSettings._id).subscribe(result => {

        this.toastService.edit('', 'Configurações');
        this.closeModal();
        this.authenticationService.updateCurrentUser();
      }, err => this.toastService.error(err));
    }
  }

  closeModal() {
    this.activeModal.close();
  }

}

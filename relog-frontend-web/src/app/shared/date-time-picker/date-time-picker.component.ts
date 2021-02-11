import {
  Component,
  OnInit,
  Input,
  Output,
  forwardRef,
  ViewChild,
  AfterViewInit,
  EventEmitter,
} from "@angular/core";
import {
  NgbTimeStruct,
  NgbDateStruct,
  NgbPopoverConfig,
  NgbPopover,
  NgbDatepicker,
} from "@ng-bootstrap/ng-bootstrap";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl,
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { DateTimeModel } from "./date-time.model";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
// import { noop } from "rxjs";

@Component({
  selector: "app-date-time-picker",
  templateUrl: "./date-time-picker.component.html",
  styleUrls: ["./date-time-picker.component.css"],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    },
  ],
})
export class DateTimePickerComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  faCalendar = faCalendar;
  faClock = faClock;

  @Input()
  dateString: string;

  @Input()
  inputDatetimeFormat = "M/d/yyyy H:mm:ss";
  @Input()
  hourStep = 1;
  @Input()
  minuteStep = 5;
  @Input()
  secondStep = 30;
  @Input()
  seconds = true;

  @Input()
  disabled = false;

  private showTimePickerToggle = false;

  private datetime: DateTimeModel = new DateTimeModel();
  private firstTimeAssign = true;

  // @ViewChild(NgbDatepicker, { static: true })
  // private dp: NgbDatepicker;

  @ViewChild(NgbPopover)
  private popover: NgbPopover;

  private onTouched: any;
  private onChange: any;

  private ngControl: NgControl;

  @Output('onChangeEmitter')
  onChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private config: NgbPopoverConfig) {
    // config.triggers = "manual:outside";
    config.placement = "auto";
  }

  ngOnInit(): void { 
  }

  ngAfterViewInit(): void {
    this.popover.hidden.subscribe(($event) => {
      this.showTimePickerToggle = false;
    });
  }

  writeValue(newModel: string) {
    if (newModel) {
      this.datetime = Object.assign(
        this.datetime,
        DateTimeModel.fromLocalString(newModel)
      );
      this.dateString = newModel;
      this.setDateStringModel();
    } else {
      this.datetime = new DateTimeModel();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDateTimeState($event) {
    this.showTimePickerToggle = !this.showTimePickerToggle;
    $event.stopPropagation();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange($event: any) {
    const value = $event.target.value;
    const dt = DateTimeModel.fromLocalString(value);

    if (dt) {
      this.datetime = dt;
      this.setDateStringModel();
    } else if (value.trim() === "") {
      this.datetime = new DateTimeModel();
      this.dateString = "";
      this.onChange(this.dateString);
    } else {
      this.onChange(value);
    }
  }

  onDateChange($event: string | NgbDateStruct, dp: NgbDatepicker) {
    const date = new DateTimeModel($event);

    if (!date) {
      this.dateString = this.dateString;
      return;
    }

    if (!this.datetime) {
      this.datetime = date;
    }

    this.datetime.year = date.year;
    this.datetime.month = date.month;
    this.datetime.day = date.day;

    const adjustedDate = new Date(this.datetime.toString());
    if (this.datetime.timeZoneOffset !== adjustedDate.getTimezoneOffset()) {
      this.datetime.timeZoneOffset = adjustedDate.getTimezoneOffset();
    }

    this.setDateStringModel();
  }

  onTimeChange(event: NgbTimeStruct) {

    this.datetime.hour = event.hour;
    this.datetime.minute = event.minute;
    this.datetime.second = event.second;

    this.datetime = this.datetime;

    this.setDateStringModel();
  }

  setDateStringModel() {
    this.dateString = this.datetime.toString();

    if (!this.firstTimeAssign) {
      this.onChange(this.dateString);
    } else {
      // Skip very first assignment to null done by Angular
      if (this.dateString !== null) {
        this.firstTimeAssign = false;
      }
    }
  }

  inputBlur($event) {
    this.onTouched(); 
  }

  close(){ 
    this.onChangeEmitter.emit(this.dateString);
    this.popover.close();
  }
}

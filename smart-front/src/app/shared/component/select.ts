import { Component, Input } from '@angular/core';


@Component({
  styleUrls: ['./gc16-adicionar.component.css'],
  selector: 'test-rec',
  template: `
  <select [(ngModel)]="selectedItem" (ngModelChange)="callback($event)"  >
     <optgroup *ngFor="let obj of items" label="{{obj._id}}">
        <option *ngFor="let item of obj.items" [ngValue]="item">
            {{item.duns}}
        </option>
    </optgroup>
  </select>
  `
})
export class SelectComponent {
  @Input('select') selectedItem: any;
  @Input('items') items: any;
  @Input('callback') callback: Function;
  @Input('service') service: any;
  @Input('output') output: any;

}

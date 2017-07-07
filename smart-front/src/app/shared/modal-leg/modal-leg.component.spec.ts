import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLegComponent } from './modal-leg.component';

describe('ModalLegComponent', () => {
  let component: ModalLegComponent;
  let fixture: ComponentFixture<ModalLegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

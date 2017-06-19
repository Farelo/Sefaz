import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRastComponent } from './modal-rast.component';

describe('ModalRastComponent', () => {
  let component: ModalRastComponent;
  let fixture: ComponentFixture<ModalRastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

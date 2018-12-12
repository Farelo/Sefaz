import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInvComponent } from './modal-inv.component';

describe('AlertaComponent', () => {
  let component: ModalInvComponent;
  let fixture: ComponentFixture<ModalInvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaAusenteComponent } from './alerta-ausente.component';

describe('AlertaAusenteComponent', () => {
  let component: AlertaAusenteComponent;
  let fixture: ComponentFixture<AlertaAusenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertaAusenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaAusenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

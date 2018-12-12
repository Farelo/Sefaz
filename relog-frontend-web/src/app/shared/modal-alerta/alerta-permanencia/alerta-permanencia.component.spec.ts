import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaPermanenciaComponent } from './alerta-permanencia.component';

describe('AlertaPermanenciaComponent', () => {
  let component: AlertaPermanenciaComponent;
  let fixture: ComponentFixture<AlertaPermanenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertaPermanenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaPermanenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaLocalIncorretoComponent } from './alerta-local-incorreto.component';

describe('AlertaLocalIncorretoComponent', () => {
  let component: AlertaLocalIncorretoComponent;
  let fixture: ComponentFixture<AlertaLocalIncorretoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertaLocalIncorretoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaLocalIncorretoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

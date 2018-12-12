import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaBateriaBaixaComponent } from './alerta-bateria-baixa.component';

describe('AlertaBateriaBaixaComponent', () => {
  let component: AlertaBateriaBaixaComponent;
  let fixture: ComponentFixture<AlertaBateriaBaixaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertaBateriaBaixaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaBateriaBaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

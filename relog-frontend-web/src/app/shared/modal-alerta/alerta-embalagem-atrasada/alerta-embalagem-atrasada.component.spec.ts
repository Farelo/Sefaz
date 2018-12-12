import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaEmbalagemAtrasadaComponent } from './alerta-embalagem-atrasada.component';

describe('AlertaEmbalagemAtrasadaComponent', () => {
  let component: AlertaEmbalagemAtrasadaComponent;
  let fixture: ComponentFixture<AlertaEmbalagemAtrasadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertaEmbalagemAtrasadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaEmbalagemAtrasadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

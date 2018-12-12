import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaEmbalagemPerdidaComponent } from './alerta-embalagem-perdida.component';

describe('AlertaEmbalagemPerdidaComponent', () => {
  let component: AlertaEmbalagemPerdidaComponent;
  let fixture: ComponentFixture<AlertaEmbalagemPerdidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertaEmbalagemPerdidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaEmbalagemPerdidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

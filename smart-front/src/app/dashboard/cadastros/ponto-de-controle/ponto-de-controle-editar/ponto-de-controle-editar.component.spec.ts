import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PontoDeControleEditarComponent } from './ponto-de-controle-editar.component';

describe('PontoDeControleEditarComponent', () => {
  let component: PontoDeControleEditarComponent;
  let fixture: ComponentFixture<PontoDeControleEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PontoDeControleEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PontoDeControleEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

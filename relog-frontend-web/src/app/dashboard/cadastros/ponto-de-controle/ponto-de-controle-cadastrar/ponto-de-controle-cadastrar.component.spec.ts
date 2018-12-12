import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PontoDeControleCadastrarComponent } from './ponto-de-controle-cadastrar.component';

describe('PontoDeControleCadastrarComponent', () => {
  let component: PontoDeControleCadastrarComponent;
  let fixture: ComponentFixture<PontoDeControleCadastrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PontoDeControleCadastrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PontoDeControleCadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

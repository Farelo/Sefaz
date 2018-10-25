import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PontoDeControleComponent } from './ponto-de-controle.component';

describe('PontoDeControleComponent', () => {
  let component: PontoDeControleComponent;
  let fixture: ComponentFixture<PontoDeControleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PontoDeControleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PontoDeControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
